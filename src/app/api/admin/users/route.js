import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { sendMail } from '@/lib/mailer';
import { adminAccessEmail } from '@/lib/emailTemplates';
import { generateCode, hashCode, expiresAt, CODE_TTL_MINUTES } from '@/lib/adminVerification';

const PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/** Random temporary password that satisfies typical complexity rules. */
function generateTempPassword(length = 12) {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += PASSWORD_ALPHABET[crypto.randomInt(0, PASSWORD_ALPHABET.length)];
  }
  return `${out}B!1`;
}

/**
 * Creates a pending verification row and emails the one-time code.
 * Until the row is marked verified_at, that admin cannot use the dashboard.
 */
async function issueAdminCode({ userId, email, firstName, tempPassword = null }) {
  const code = generateCode();

  const { error } = await supabaseAdmin.from('admin_verification').upsert(
    {
      user_id: userId,
      code_hash: hashCode(userId, code),
      expires_at: expiresAt(),
      attempts: 0,
      verified_at: null,
    },
    { onConflict: 'user_id' }
  );

  if (error) throw error;

  await sendMail({
    to: email,
    ...adminAccessEmail({
      firstName,
      email,
      code,
      tempPassword,
      expiresIn: `${CODE_TTL_MINUTES} minutes`,
    }),
  });
}

// GET all users (admin only)
export async function GET(req) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    // 1. Fetch profiles AND their related subscriptions from the new table
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id, first_name, last_name, email, company, role, created_at, updated_at, status, avatar_url,
        user_subscriptions ( module_id, status ) 
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 2. Map auth data and format the relational subscriptions into a simple array
    const usersWithAuthData = await Promise.all(
      profiles.map(async (profile) => {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.id);
        
        // Extract just the module IDs where the subscription is 'active'
        const activeModules = profile.user_subscriptions
          ?.filter(sub => sub.status === 'active')
          .map(sub => sub.module_id) || [];

        // Remove the raw relational object and replace it with the array the frontend expects
        delete profile.user_subscriptions;

        const meta = authUser?.user?.user_metadata || {};
        const contactDetails = profile.phone || meta.contact_details || meta.phone || '';
        const address = profile.address || meta.address || '';

        return {
          ...profile,
          contact_details: contactDetails,
          phone: contactDetails,
          address: address,
          subscribed_modules: activeModules, // <-- This passes the array back to your frontend!
          email_confirmed: !!authUser?.user?.email_confirmed_at,
          last_sign_in: authUser?.user?.last_sign_in_at,
          auth_created_at: authUser?.user?.created_at
        };
      })
    );

    return NextResponse.json({
      users: usersWithAuthData,
      total: usersWithAuthData.length
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ message: "An unexpected error occurred", error: error.message }, { status: 500 });
  }
}

// POST - Merged actions for Create Admin, Update Admin, Update Role, Delete User, and Cancel Subscription
export async function POST(req) {
  try {
    const body = await req.json();
    const { action, userId, newRole, email, password, firstName, lastName, fullName, contactDetails, phone, address } = body;

    if (!supabaseAdmin) {
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    // ACTION: CREATE ADMIN
    if (action === 'createAdmin') {
      let fName = firstName;
      let lName = lastName;

      if (fullName && (!fName || !lName)) {
        const parts = fullName.trim().split(/\s+/);
        fName = fName || parts[0];
        lName = lName || parts.slice(1).join(' ');
      }

      if (!email || !fName) {
        return NextResponse.json({ message: "Email and full name (or first name) are required." }, { status: 400 });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const contact = (contactDetails || phone || '').trim();
      const addr = (address || '').trim();
      const tempPassword = password || generateTempPassword();

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: fName,
          last_name: lName || '',
          phone: contact,
          contact_details: contact,
          address: addr,
          role: 'admin'
        }
      });

      if (authError) {
        const exists = /already|exists|registered/i.test(authError.message);

        if (!exists) {
          return NextResponse.json({ message: authError.message }, { status: 500 });
        }

        // Recovery path: an earlier attempt may have created the account but
        // failed before the code was stored (e.g. the admin_verification table
        // did not exist yet). Re-issue instead of dead-ending on a 409.
        const { data: existing } = await supabaseAdmin
          .from('profiles')
          .select('id, email, first_name, role')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (!existing || existing.role !== 'admin') {
          return NextResponse.json({ message: "That email already has an account." }, { status: 409 });
        }

        const { data: verification } = await supabaseAdmin
          .from('admin_verification')
          .select('verified_at')
          .eq('user_id', existing.id)
          .maybeSingle();

        if (verification?.verified_at) {
          return NextResponse.json(
            { message: "That person is already a verified administrator." },
            { status: 409 }
          );
        }

        await issueAdminCode({
          userId: existing.id,
          email: existing.email,
          firstName: existing.first_name || fName
        });

        return NextResponse.json(
          { message: "That administrator already existed. A new access code has been emailed.", userId: existing.id },
          { status: 200 }
        );
      }

      const newUserId = authData.user.id;

      try {
        const profileData = {
          id: newUserId,
          first_name: fName,
          last_name: lName || null,
          email: normalizedEmail,
          role: 'admin',
          updated_at: new Date().toISOString()
        };

        // Attempt upsert with phone and address columns if available; gracefully fallback
        try {
          const { error: pErr } = await supabaseAdmin
            .from('profiles')
            .upsert({ ...profileData, phone: contact || null, address: addr || null }, { onConflict: 'id' });
          if (pErr) {
            const { error: fbErr } = await supabaseAdmin.from('profiles').upsert(profileData, { onConflict: 'id' });
            if (fbErr) throw fbErr;
          }
        } catch {
          const { error: fbErr } = await supabaseAdmin.from('profiles').upsert(profileData, { onConflict: 'id' });
          if (fbErr) throw fbErr;
        }

        await issueAdminCode({
          userId: newUserId,
          email: normalizedEmail,
          firstName: fName,
          tempPassword
        });
      } catch (provisionError) {
        // Never leave a half-provisioned admin behind: no code means no way in.
        console.error("Admin provisioning failed, rolling back user:", provisionError);
        try {
          await supabaseAdmin.auth.admin.deleteUser(newUserId);
        } catch (rollbackError) {
          console.error("Rollback failed for user", newUserId, rollbackError);
        }
        throw provisionError;
      }

      return NextResponse.json(
        { message: "Administrator credentials created. A one-time access code has been emailed.", userId: newUserId },
        { status: 201 }
      );
    }

    // ACTION: UPDATE ADMIN CREDENTIALS
    if (action === 'updateAdmin') {
      if (!userId) {
        return NextResponse.json({ message: "Administrator User ID is required." }, { status: 400 });
      }

      let fName = firstName;
      let lName = lastName;
      if (fullName && (!fName || !lName)) {
        const parts = fullName.trim().split(/\s+/);
        fName = fName || parts[0];
        lName = lName || parts.slice(1).join(' ');
      }

      const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
      const contact = contactDetails !== undefined ? contactDetails.trim() : (phone !== undefined ? phone.trim() : undefined);
      const addr = address !== undefined ? address.trim() : undefined;

      // 1. Verify target is admin
      const { data: existingProfile, error: fetchErr } = await supabaseAdmin
        .from('profiles')
        .select('id, email, first_name, last_name, role')
        .eq('id', userId)
        .single();

      if (fetchErr || !existingProfile) {
        return NextResponse.json({ message: "Administrator account not found." }, { status: 404 });
      }

      if (existingProfile.role !== 'admin') {
        return NextResponse.json({ message: "Target account is not an administrator." }, { status: 403 });
      }

      // 2. Fetch existing auth user metadata
      const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId);
      const existingMeta = authData?.user?.user_metadata || {};

      const updatedMeta = {
        ...existingMeta,
        first_name: fName !== undefined ? fName : (existingProfile.first_name || ''),
        last_name: lName !== undefined ? lName : (existingProfile.last_name || ''),
        role: 'admin'
      };

      if (contact !== undefined) {
        updatedMeta.phone = contact;
        updatedMeta.contact_details = contact;
      }
      if (addr !== undefined) {
        updatedMeta.address = addr;
      }

      const authUpdatePayload = {
        user_metadata: updatedMeta
      };

      if (normalizedEmail && normalizedEmail !== authData?.user?.email) {
        authUpdatePayload.email = normalizedEmail;
        authUpdatePayload.email_confirm = true;
      }

      const { error: authUpdateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, authUpdatePayload);
      if (authUpdateErr) {
        return NextResponse.json({ message: `Failed to update auth credentials: ${authUpdateErr.message}` }, { status: 500 });
      }

      // 3. Update public.profiles
      const profileUpdates = {
        first_name: updatedMeta.first_name,
        last_name: updatedMeta.last_name,
        updated_at: new Date().toISOString()
      };
      if (normalizedEmail) {
        profileUpdates.email = normalizedEmail;
      }

      try {
        const fullProfileUpdate = { ...profileUpdates };
        if (contact !== undefined) fullProfileUpdate.phone = contact || null;
        if (addr !== undefined) fullProfileUpdate.address = addr || null;
        const { error: pErr } = await supabaseAdmin
          .from('profiles')
          .update(fullProfileUpdate)
          .eq('id', userId);
        if (pErr) {
          const { error: fbErr } = await supabaseAdmin
            .from('profiles')
            .update(profileUpdates)
            .eq('id', userId);
          if (fbErr) throw fbErr;
        }
      } catch {
        const { error: fbErr } = await supabaseAdmin
          .from('profiles')
          .update(profileUpdates)
          .eq('id', userId);
        if (fbErr) throw fbErr;
      }

      return NextResponse.json({
        message: "Administrator credentials updated successfully.",
        user: {
          id: userId,
          first_name: updatedMeta.first_name,
          last_name: updatedMeta.last_name,
          email: normalizedEmail || existingProfile.email,
          contact_details: updatedMeta.contact_details,
          phone: updatedMeta.phone,
          address: updatedMeta.address,
          role: 'admin'
        }
      }, { status: 200 });
    }

    // ACTION: UPDATE ROLE
    if (action === 'updateRole') {
      if (!userId || !newRole || !['admin', 'customer'].includes(newRole)) {
        return NextResponse.json({ message: "Invalid userId or role." }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select();

      if (error) throw error;

      // Promoting someone to admin also requires the one-time code.
      if (newRole === 'admin') {
        const profile = data[0];
        try {
          await issueAdminCode({
            userId,
            email: profile.email,
            firstName: profile.first_name
          });
        } catch (mailErr) {
          console.error('Could not send admin access code:', mailErr);
        }
      }

      return NextResponse.json({ message: `User role updated to ${newRole}`, user: data[0] });
    }

    // ACTION: DELETE USER
    if (action === 'delete') {
      // 1. Delete from Profiles Table FIRST (Prevents Foreign Key Constraint errors)
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) throw profileError;

      // 2. Delete from Supabase Auth SECOND (Removes login access)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      return NextResponse.json({ message: "User completely deleted from system." }, { status: 200 });
    }

    // --- NEW ACTION: CANCEL SUBSCRIPTION ---
    if (action === 'cancelSubscription') {
      if (!userId) {
        return NextResponse.json({ message: "User ID is required." }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ subscribed_modules: [], updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select();

      if (error) throw error;
      return NextResponse.json({ message: "User subscription successfully cancelled.", user: data[0] });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ message: "Failed to process request", error: error.message }, { status: 500 });
  }
}
