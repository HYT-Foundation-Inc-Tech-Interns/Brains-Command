'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  ArrowLeft, Mail, Building, Calendar, Clock, ShieldCheck, 
  AlertTriangle, CheckCircle, XCircle, CheckCircle2, Lock, 
  Unlock, Eye, Loader2, Copy, CheckCheck, Sparkles, AlertCircle,
  Activity, RefreshCw, Send, User, ChevronRight
} from 'lucide-react';

const MODULE_DEFINITIONS = [
  { id: 'hms', name: 'Frontdesk (HMS)', category: 'Core Facilities', desc: 'Hotel & Hospitality Management System', color: 'indigo' },
  { id: 'pms', name: 'Landlord (PMS)', category: 'Core Facilities', desc: 'Commercial & Residential Property Management', color: 'blue' },
  { id: 'hvms', name: 'Butler (HVMS)', category: 'Core Facilities', desc: 'High-Value Property & Villa Concierge', color: 'fuchsia' },
  { id: 'bms', name: 'Sekyu (BMS)', category: 'Core Facilities', desc: 'Building Management & Security Surveillance', color: 'emerald' },
  { id: 'iot', name: 'Housekeeper (IoT)', category: 'Core Facilities', desc: 'Environmental & Sensor Telemetry Hub', color: 'cyan' },
];

export default function CustomerProfileValidationPage({ params }) {
  const unwrappedParams = use(params);
  const customerId = unwrappedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Trial Provisioning Form State
  const [selectedModules, setSelectedModules] = useState(['hms', 'pms', 'hvms', 'bms', 'iot']);
  const [trialDays, setTrialDays] = useState(14);
  const [adminNote, setAdminNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);

  // Fetch single customer profile and validation telemetry
  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const res = await fetch(`/api/admin/users/${customerId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Customer profile not found.');
      }

      setCustomerData(data);
      if (data.customer?.subscribed_modules && data.customer.subscribed_modules.length > 0) {
        setSelectedModules(data.customer.subscribed_modules);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleToggleModule = (modId) => {
    setSelectedModules(prev => 
      prev.includes(modId) ? prev.filter(m => m !== modId) : [...prev, modId]
    );
  };

  const handleSelectAll = () => {
    setSelectedModules(MODULE_DEFINITIONS.map(m => m.id));
  };

  const handleClearAll = () => {
    setSelectedModules([]);
  };

  // Submit Approval or Rejection
  const handleTrialAction = async (action) => {
    if (action === 'approve' && selectedModules.length === 0) {
      alert('Please select at least one module to unlock for this trial.');
      return;
    }

    try {
      setSubmitting(true);
      setActionSuccessMessage(null);

      const res = await fetch('/api/admin/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customerId,
          email: customerData.customer.email,
          name: customerData.customer.first_name || 'Customer',
          action,
          modules: selectedModules,
          trialDays,
          adminNote: action === 'approve' ? adminNote : '',
          reason: action === 'reject' ? rejectReason : ''
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Action failed.');
      }

      setActionSuccessMessage(result.message);
      setShowRejectBox(false);
      // Re-fetch updated profile
      await fetchCustomer();
    } catch (err) {
      alert(`Error processing trial request: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isFreeEmailProvider = (email = '') => {
    const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return freeDomains.includes(domain);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b14] flex flex-col items-center justify-center p-6 text-white font-sans">
        <Loader2 className="w-10 h-10 text-fuchsia-500 animate-spin mb-4" />
        <div className="text-lg font-bold tracking-wide">Loading Customer Profile & Validation Data...</div>
        <div className="text-xs text-indigo-400 mt-1">Inspecting identity, security verification, and trial specs</div>
      </div>
    );
  }

  if (error || !customerData?.customer) {
    return (
      <div className="min-h-screen bg-[#090b14] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-[#13172e] border border-red-500/40 rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Customer Not Found</h2>
          <p className="text-sm text-indigo-300 mb-6">{error || "Could not retrieve the requested customer profile."}</p>
          <Link
            href="/admin-dashboard"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { customer, subscriptions, inquiries, companyPeers } = customerData;
  const isPending = customer.status === 'pending';
  const isActive = customer.status === 'active';
  const isRejected = customer.status === 'rejected';
  const hasFreeEmail = isFreeEmailProvider(customer.email);

  return (
    <div className="min-h-screen bg-[#090b14] text-gray-100 font-sans p-4 md:p-8 selection:bg-fuchsia-500/30 selection:text-fuchsia-100 relative">
      {/* Subtle sci-fi ambient gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-fuchsia-600/10 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        
        {/* Top Breadcrumb & Return Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/40 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin-dashboard"
              className="inline-flex items-center gap-2 bg-[#13172e] hover:bg-[#1c2242] border border-indigo-800/60 text-indigo-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Customers Directory
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-400/80 font-mono">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3 text-indigo-600" />
              <span>Customers</span>
              <ChevronRight className="w-3 h-3 text-indigo-600" />
              <span className="text-white font-bold">{customer.first_name} {customer.last_name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCustomer}
              className="p-2 bg-[#13172e] border border-indigo-800/60 hover:border-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <span className="text-xs text-indigo-400 font-mono">
              Telemetry Live
            </span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccessMessage && (
          <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 text-emerald-300 text-sm flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Action Completed:</span> {actionSuccessMessage}
              </div>
            </div>
            <button 
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1 rounded"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Customer Profile Card */}
        <div className="bg-[#13172e]/90 border border-indigo-800/60 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {customer.avatar_url ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-lg shrink-0">
                  <img src={customer.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-900 to-fuchsia-900 border-2 border-indigo-500/40 flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-2xl font-black text-white font-mono">
                    {(`${customer.first_name?.[0] || ''}${customer.last_name?.[0] || ''}`.toUpperCase()) || 'CC'}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {customer.first_name} {customer.last_name}
                  </h1>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                    {customer.role || 'customer'}
                  </span>
                  
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)] animate-pulse">
                      <Clock className="w-3.5 h-3.5" /> Pending Trial Request
                    </span>
                  )}
                  {isActive && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                      <CheckCircle className="w-3.5 h-3.5" /> Active / Approved
                    </span>
                  )}
                  {isRejected && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/50">
                      <XCircle className="w-3.5 h-3.5" /> Request Rejected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs md:text-sm text-indigo-300 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-indigo-400" /> {customer.email}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Building className="w-4 h-4 text-fuchsia-400" /> {customer.company || 'Independent / No Company Specified'}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-indigo-400">
                    <Calendar className="w-4 h-4" /> Joined: {new Date(customer.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Badge & Identifier */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 bg-[#090b14]/50 p-4 rounded-2xl border border-indigo-900/60">
              <div className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">Account UUID</div>
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-200">
                <span>{customer.id}</span>
                <button 
                  onClick={() => copyToClipboard(customer.id)}
                  className="p-1 hover:text-white transition-colors"
                  title="Copy UUID"
                >
                  {copiedId ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-[11px] text-indigo-400/80 mt-1">
                Last sign in: {customer.last_sign_in ? new Date(customer.last_sign_in).toLocaleString() : 'Never'}
              </div>
            </div>
          </div>
        </div>

        {/* Validation Intelligence & Trial Provisioning Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Deep Validation Checks & Customer Intelligence (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Validation Checklist Card */}
            <div className="bg-[#13172e] border border-indigo-800/50 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-fuchsia-400" />
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Careful Validation Checklist
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-800/40">
                  Risk & Integrity Signals
                </span>
              </div>

              <div className="space-y-3">
                
                {/* 1. Supabase Auth Email Confirmation */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-[#090b14]/60 border border-indigo-900/50">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full ${customer.email_confirmed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {customer.email_confirmed ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Email Address Verification</div>
                      <div className="text-xs text-indigo-300/80 mt-0.5">
                        {customer.email_confirmed 
                          ? `Confirmed on ${new Date(customer.email_confirmed_at).toLocaleString()}`
                          : 'Email confirmation link not yet completed in Supabase Auth.'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    customer.email_confirmed 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {customer.email_confirmed ? 'Verified' : 'Unconfirmed'}
                  </span>
                </div>

                {/* 2. Corporate Domain vs Free Webmail Provider Check */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-[#090b14]/60 border border-indigo-900/50">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full ${!hasFreeEmail ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {!hasFreeEmail ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Domain Legitimacy Check</div>
                      <div className="text-xs text-indigo-300/80 mt-0.5">
                        {!hasFreeEmail ? (
                          <span>Corporate custom domain identified: <code className="text-fuchsia-300 font-mono">@{customer.email.split('@')[1]}</code></span>
                        ) : (
                          <span>Public/Free webmail provider detected (<code className="text-amber-300 font-mono">@{customer.email.split('@')[1]}</code>). Verify company authenticity.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    !hasFreeEmail 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {!hasFreeEmail ? 'Corporate Domain' : 'Public Webmail'}
                  </span>
                </div>

                {/* 3. Organization Co-workers / Duplicate Check */}
                <div className="flex items-start justify-between p-3.5 rounded-xl bg-[#090b14]/60 border border-indigo-900/50">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full ${companyPeers.length > 0 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Company Account Check ({customer.company || 'N/A'})</div>
                      <div className="text-xs text-indigo-300/80 mt-0.5">
                        {companyPeers.length > 0 ? (
                          <span>Found <strong>{companyPeers.length} other registered user(s)</strong> belonging to the same company.</span>
                        ) : (
                          <span>First registered user associated with this organization.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-indigo-500/10 text-indigo-300 border-indigo-700/40">
                    {companyPeers.length > 0 ? `${companyPeers.length} Peers` : 'Unique Firm'}
                  </span>
                </div>

                {/* Peer List if any */}
                {companyPeers.length > 0 && (
                  <div className="p-3 bg-[#090b14]/40 border border-indigo-950 rounded-xl space-y-1.5">
                    <div className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Existing Accounts at {customer.company}:</div>
                    {companyPeers.map(peer => (
                      <div key={peer.id} className="flex items-center justify-between text-xs py-1 border-b border-indigo-900/20 last:border-none">
                        <span className="text-indigo-200">{peer.first_name} {peer.last_name} ({peer.email})</span>
                        <span className="text-[10px] font-mono uppercase text-indigo-400">Status: {peer.status || 'new'}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* Inquiries & Custom Messages History */}
            <div className="bg-[#13172e] border border-indigo-800/50 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    Inquiries & Request Message History
                  </h2>
                </div>
                <span className="text-xs text-indigo-400 font-mono">
                  {inquiries.length} Record(s)
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-6 text-center text-xs text-indigo-400/80 bg-[#090b14]/40 rounded-xl border border-indigo-900/30">
                  No additional inquiry tickets submitted under email <span className="font-mono text-indigo-300">{customer.email}</span>.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-4 bg-[#090b14]/70 border border-indigo-900/60 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                          {inq.type || 'Trial Request'}
                        </span>
                        <span className="text-[10px] text-indigo-400 font-mono">
                          {new Date(inq.created_at).toLocaleString()}
                        </span>
                      </div>
                      {inq.subject && (
                        <div className="text-xs font-semibold text-indigo-200">
                          Subject: {inq.subject}
                        </div>
                      )}
                      <div className="text-xs text-indigo-300/90 whitespace-pre-line leading-relaxed bg-[#13172e]/60 p-3 rounded-lg border border-indigo-800/30">
                        {inq.details || 'No additional specifications provided.'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Provisioning Controller & Module Unlock Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Trial Provisioning & Module Unlock Box */}
            <div className="bg-[#13172e] border border-amber-500/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.15)] space-y-5">
              <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Trial Provisioning Console
                  </h2>
                  <p className="text-[11px] text-indigo-300">
                    Select modules to unlock in the customer dashboard
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAll}
                    type="button"
                    className="text-[10px] font-bold text-fuchsia-400 hover:text-fuchsia-300 uppercase tracking-wider underline cursor-pointer"
                  >
                    All
                  </button>
                  <span className="text-indigo-600">|</span>
                  <button
                    onClick={handleClearAll}
                    type="button"
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Module Checkbox Grid */}
              <div className="space-y-2.5">
                {MODULE_DEFINITIONS.map((mod) => {
                  const isChecked = selectedModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleToggleModule(mod.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked 
                          ? 'bg-gradient-to-r from-fuchsia-950/40 to-indigo-950/40 border-fuchsia-500/60 shadow-[0_0_15px_rgba(217,70,239,0.15)]' 
                          : 'bg-[#090b14]/60 border-indigo-900/50 hover:border-indigo-700/70 text-indigo-400/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg border ${
                          isChecked ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300' : 'bg-indigo-950 border-indigo-800 text-indigo-500'
                        }`}>
                          {isChecked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-indigo-400/80'}`}>
                            {mod.name}
                          </div>
                          <div className="text-[10px] text-indigo-400/70 truncate max-w-[200px]">
                            {mod.desc}
                          </div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isChecked ? 'bg-fuchsia-600 border-fuchsia-400 text-white' : 'border-indigo-800 bg-[#090b14]'
                      }`}>
                        {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trial Duration Selector */}
              <div>
                <label className="block text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wide">
                  Trial Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 14, 30].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setTrialDays(days)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        trialDays === days
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-[#090b14]/50 border-indigo-900 text-indigo-400 hover:border-indigo-700'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Note Input (Included in Approval Email) */}
              <div>
                <label className="block text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wide">
                  Custom Onboarding Note (Included in Email)
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Priority setup enabled. Dedicated support engineer assigned."
                  className="w-full bg-[#090b14] border border-indigo-800/60 rounded-xl p-3 text-xs text-white placeholder-indigo-600 focus:outline-none focus:border-fuchsia-500 transition-colors"
                />
              </div>

              {/* Actions: Approve / Reject Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={submitting || selectedModules.length === 0}
                  onClick={() => handleTrialAction('approve')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Provisioning Systems...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approve Trial, Unlock Modules & Send Email
                    </>
                  )}
                </button>

                {!showRejectBox ? (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setShowRejectBox(true)}
                    className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-500/40 text-red-400 hover:text-red-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Reject Trial Request
                  </button>
                ) : (
                  <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl space-y-3 animate-fadeIn">
                    <label className="block text-[11px] font-bold text-red-300 uppercase tracking-wide">
                      Rejection Reason (Emailed to Customer)
                    </label>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Specify why validation failed (e.g. unverified business domain)..."
                      className="w-full bg-[#090b14] border border-red-500/40 rounded-lg p-2.5 text-xs text-white placeholder-red-900 focus:outline-none focus:border-red-400"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRejectBox(false)}
                        className="w-1/2 py-2 text-xs font-bold text-indigo-300 hover:text-white bg-[#090b14] border border-indigo-800 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleTrialAction('reject')}
                        className="w-1/2 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md transition-all active:scale-95"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Currently Active Subscriptions Telemetry */}
            <div className="bg-[#13172e] border border-indigo-800/50 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Active Unlocked Modules
                </h3>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                  {customer.subscribed_modules?.length || 0} Active
                </span>
              </div>

              {customer.subscribed_modules && customer.subscribed_modules.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {customer.subscribed_modules.map((modId) => {
                    const mod = MODULE_DEFINITIONS.find(m => m.id === modId);
                    return (
                      <span
                        key={modId}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {mod?.name || modId.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-indigo-400/70 italic py-2">
                  No active modules unlocked for this account yet. Use the Provisioning Console above to grant access.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
