import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendMail } from '@/lib/mailer';
import { trialApprovedEmail, trialRejectedEmail } from '@/lib/emailTemplates';

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      userId, 
      email, 
      action, 
      name, 
      modules = ['hms', 'pms', 'hvms', 'bms', 'iot'], 
      trialDays = 14,
      reason = '',
      adminNote = ''
    } = body;

    if (!userId || !email || !action) {
      return NextResponse.json({ message: "Missing required parameters (userId, email, action)." }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'active' : 'rejected';

    // 1. Update the user's status in Supabase profiles
    const { error: dbError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (dbError) {
      console.error('Database update error on profiles:', dbError);
      throw dbError;
    }

    // 2. If approved, unlock the requested/default modules in user_subscriptions
    if (action === 'approve') {
      const activeModules = modules && modules.length > 0
        ? modules
        : ['hms', 'pms', 'hvms', 'bms', 'iot'];

      const subscriptionInserts = activeModules.map(moduleId => ({
        user_id: userId,
        module_id: moduleId,
        status: 'active',
        created_at: new Date().toISOString()
      }));

      const { error: subError } = await supabaseAdmin
        .from('user_subscriptions')
        .upsert(subscriptionInserts, { onConflict: 'user_id, module_id' });

      if (subError) {
        console.error('Failed to upsert user_subscriptions:', subError);
        // We log it, but proceed with email notification
      }

      // 3. Dispatch the branded trial approval email
      try {
        const mailData = trialApprovedEmail({
          firstName: name,
          email,
          modules: activeModules,
          trialDays: Number(trialDays) || 14,
          adminNote
        });

        await sendMail({
          to: email,
          ...mailData,
        });
      } catch (mailError) {
        console.warn('Mail notification warning (approval already committed):', mailError.message);
      }

      return NextResponse.json({ 
        success: true,
        message: `Trial approved successfully. ${activeModules.length} modules unlocked and notification email dispatched.`,
        unlockedModules: activeModules
      }, { status: 200 });

    } else {
      // Action is 'reject'
      // Optionally deactivate any pending subscriptions
      await supabaseAdmin
        .from('user_subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', userId);

      // Dispatch rejection notification email
      try {
        const mailData = trialRejectedEmail({
          firstName: name,
          email,
          reason
        });

        await sendMail({
          to: email,
          ...mailData,
        });
      } catch (mailError) {
        console.warn('Mail notification warning (rejection already committed):', mailError.message);
      }

      return NextResponse.json({ 
        success: true,
        message: 'Trial request rejected and customer notified via email.' 
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Trial action API error:', error);
    return NextResponse.json({ 
      success: false,
      message: "Failed to process trial request.", 
      error: error.message 
    }, { status: 500 });
  }
}
