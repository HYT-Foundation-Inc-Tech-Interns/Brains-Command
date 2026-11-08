import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const body = await req.json();
    let { 
      firstName, 
      lastName, 
      fullName, 
      email, 
      company, 
      password, 
      type, 
      systemName, 
      details 
    } = body;

    const normalizedEmail = (email || '').trim().toLowerCase();

    // 1. Check if the user's profile exists in the database
    const { data: profile, error: profileFetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name, company, status')
      .ilike('email', normalizedEmail)
      .maybeSingle();

    if (profileFetchError || !profile) {
      return NextResponse.json({ 
        message: "Account not found. Please create an account before requesting a free trial." 
      }, { status: 404 }); // Triggers the Account Not Found modal on the frontend
    }

    // 2. Validate password via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ 
        message: "Incorrect password. Please verify your account password." 
      }, { status: 401 }); // Triggers the red error banner
    }

    // 3. Resolve names if fullName was provided instead of separate fields
    if (!firstName && fullName) {
      const parts = fullName.trim().split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || '';
    }

    // 4. Validate First Name, Last Name, and Company against profile
    const inputFirst = (firstName || '').trim().toLowerCase();
    const inputLast = (lastName || '').trim().toLowerCase();
    const inputComp = (company || '').trim().toLowerCase();

    const profileFirst = (profile.first_name || '').trim().toLowerCase();
    const profileLast = (profile.last_name || '').trim().toLowerCase();
    const profileComp = (profile.company || '').trim().toLowerCase();

    if (
      (inputFirst && profileFirst && inputFirst !== profileFirst) ||
      (inputLast && profileLast && inputLast !== profileLast) ||
      (inputComp && profileComp && inputComp !== profileComp)
    ) {
      return NextResponse.json({ 
        message: "The Name or Company provided does not match your registered account details." 
      }, { status: 400 });
    }

    // 5. Update user profile status to 'pending'
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Trial status update error:', updateError);
      return NextResponse.json({ message: "Failed to update trial status." }, { status: 500 });
    }

    // 6. Record inquiry ticket for admin visibility (specifically tags Connector Trial & system)
    const inquiryType = type || (systemName ? 'Connector Trial' : 'SaaS Trial');
    const inquirySubject = systemName ? `Connector Trial: ${systemName}` : 'SaaS Free Trial';
    const inquiryDetails = details || `Automated request for 14-day free trial of ${systemName || 'Central Command SaaS'}.`;

    try {
      await supabaseAdmin.from('inquiries').insert([{
        type: inquiryType,
        subject: inquirySubject,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.email,
        company: profile.company,
        details: inquiryDetails
      }]);
    } catch (inqErr) {
      console.warn('Inquiry insert warning (non-fatal):', inqErr.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Trial requested successfully! Your request is pending administrator validation." 
    }, { status: 200 });

  } catch (error) {
    console.error('Request trial error:', error);
    return NextResponse.json({ 
      message: "An unexpected error occurred while processing trial request.", 
      error: error.message 
    }, { status: 500 });
  }
}
