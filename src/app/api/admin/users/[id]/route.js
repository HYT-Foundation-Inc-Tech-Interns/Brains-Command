import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Customer ID is required." }, { status: 400 });
    }

    // 1. Fetch user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ message: "Customer not found." }, { status: 404 });
    }

    // 2. Fetch Supabase Auth metadata (email confirmed, last sign in)
    let authUser = null;
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.getUserById(id);
      authUser = authData?.user || null;
    } catch (authErr) {
      console.warn("Could not retrieve auth metadata for user:", authErr.message);
    }

    // 3. Fetch user's subscriptions
    const { data: subscriptions } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    const activeModules = (subscriptions || [])
      .filter(s => s.status === 'active')
      .map(s => s.module_id);

    // 4. Fetch inquiry / trial request messages submitted with this customer's email
    let inquiries = [];
    if (profile.email) {
      const { data: inqData } = await supabaseAdmin
        .from('inquiries')
        .select('*')
        .ilike('email', profile.email.trim())
        .order('created_at', { ascending: false });
      inquiries = inqData || [];
    }

    // 5. Check for peer accounts registered with the same company (useful for validation)
    let companyPeers = [];
    if (profile.company && profile.company.trim().length > 1) {
      const { data: peers } = await supabaseAdmin
        .from('profiles')
        .select('id, first_name, last_name, email, role, status, created_at')
        .ilike('company', profile.company.trim())
        .neq('id', id);
      companyPeers = peers || [];
    }

    // 6. Return combined customer profile with validation signals
    return NextResponse.json({
      success: true,
      customer: {
        ...profile,
        subscribed_modules: activeModules,
        email_confirmed: !!authUser?.email_confirmed_at,
        email_confirmed_at: authUser?.email_confirmed_at || null,
        last_sign_in: authUser?.last_sign_in_at || null,
        auth_created_at: authUser?.created_at || profile.created_at,
        auth_provider: authUser?.app_metadata?.provider || 'email'
      },
      subscriptions: subscriptions || [],
      inquiries,
      companyPeers
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching single customer details:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to load customer profile.", 
      error: error.message 
    }, { status: 500 });
  }
}
