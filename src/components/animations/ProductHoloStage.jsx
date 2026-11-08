'use client';

import React, { useState } from 'react';
import { 
  Building2, Landmark, ClipboardCheck, Cpu, Radio, 
  Sparkles, CheckCircle2, ArrowRight, ShieldCheck
} from 'lucide-react';
import Card3DTilt from './Card3DTilt';
import ScrollInOut from './ScrollInOut';

/**
 * ProductHoloStage - Dedicated 3D Interactive Showcase for Brains' 5 Core SaaS Systems
 * STRICTLY includes ONLY the authentic 5 Brains systems:
 * 1. HMS Frontdesk (Hotel Management System)
 * 2. PMS Landlord (Property Management System)
 * 3. HVMS Butler (Visitor Management System)
 * 4. BMS Sekyu (Building Management System)
 * 5. IoT Housekeeper (Internet of Things Command)
 * 
 * Animation & Visual Techniques:
 * - Newform 3D/VR (Pinterest Ref 1): Interactive hotspot spec pins on simulated 3D blueprints
 * - Lost in Random (Pinterest Ref 2): 3D perspective card tilt with cursor specular light beam
 * - QClay Blockchain (Pinterest Ref 3): Cybernetic radar scan, neon telemetry, and live KPIs
 */

export const coreSaasSystems = [
  {
    id: 'hms',
    code: 'HMS',
    brainsName: 'Frontdesk',
    title: 'Hotel Management System',
    tagline: 'End-to-end hotel operations, unified in real time.',
    color: 'from-fuchsia-500 to-pink-500',
    accentColor: '#d946ef',
    metric: '38%',
    metricLabel: 'average RevPAR lift in 90 days',
    icon: Building2,
    description: 'Streamline reservations, housekeeping, F&B, and revenue management from one command dashboard. Real-time room status, dynamic pricing, and channel distribution in a single pane of glass.',
    hotspots: [
      { id: 'h1', x: 26, y: 32, label: 'Central Reservation Engine', spec: 'Multi-OTA 2-way sync & live rate parity' },
      { id: 'h2', x: 68, y: 28, label: 'Housekeeping Dispatch', spec: 'Automated room assignment, task tracking & inspection' },
      { id: 'h3', x: 48, y: 72, label: 'Revenue Intelligence', spec: 'Yield management, comp-set benchmarking & dynamic pricing' }
    ],
    features: [
      { title: 'Reservations & PMS', desc: 'Central reservation engine with OTA connectivity and rate parity enforcement.' },
      { title: 'Housekeeping Dispatch', desc: 'Automated room assignment, task tracking, and inspection workflows.' },
      { title: 'Revenue Intelligence', desc: 'Yield management, comp-set benchmarking, and forecast dashboards.' },
      { title: 'F&B & POS Integration', desc: 'Restaurant, bar, and banquet billing synced directly to guest folios.' }
    ]
  },
  {
    id: 'pms',
    code: 'PMS',
    brainsName: 'Landlord',
    title: 'Property Management System',
    tagline: 'Manage every asset class from one platform.',
    color: 'from-blue-500 to-indigo-500',
    accentColor: '#3b82f6',
    metric: '61%',
    metricLabel: 'reduction in manual admin overhead',
    icon: Landmark,
    description: 'Residential, commercial, mixed-use, and vacation rental portfolios under unified control. Lease management, maintenance workflows, financial reporting, and tenant communications — all automated.',
    hotspots: [
      { id: 'p1', x: 30, y: 35, label: 'Lease Lifecycle Automation', spec: 'Digital leases, renewals, notices & e-signatures' },
      { id: 'p2', x: 72, y: 40, label: 'Maintenance Routing Hub', spec: 'Work order routing, vendor SLA verification' },
      { id: 'p3', x: 50, y: 78, label: 'Financial Ledger & GL', spec: 'GL, AR/AP, bank recon & owner distribution' }
    ],
    features: [
      { title: 'Lease Lifecycle', desc: 'Digital leases, renewals, notices, and vacancy forecasting with e-signature.' },
      { title: 'Maintenance Hub', desc: 'Work order routing, vendor management, and preventive maintenance scheduling.' },
      { title: 'Tenant Portal', desc: 'Self-service rent payment, maintenance requests, and document access.' },
      { title: 'Financial Ledger', desc: 'GL, AR/AP, bank reconciliation, and owner distribution reporting.' }
    ]
  },
  {
    id: 'hvms',
    code: 'HVMS',
    brainsName: 'Butler',
    title: 'Visitor Management System',
    tagline: 'Frictionless arrivals. Secure premises.',
    color: 'from-emerald-500 to-teal-500',
    accentColor: '#10b981',
    metric: '4 sec',
    metricLabel: 'average contactless check-in time',
    icon: ClipboardCheck,
    description: 'Digital visitor registration, pre-authorization, and contactless check-in for hotels and mixed-use properties. Integrate with access control, guard stations, and emergency mustering systems.',
    hotspots: [
      { id: 'v1', x: 35, y: 30, label: 'Pre-Registration Passes', spec: 'Invitation-based visitor pre-auth with QR pass generation' },
      { id: 'v2', x: 65, y: 38, label: 'ID Verification OCR', spec: 'Document scan, facial match, and watchlist screening' },
      { id: 'v3', x: 50, y: 68, label: 'Guard Station Console', spec: 'Tablet-optimized front-desk & security UI with photo capture' }
    ],
    features: [
      { title: 'Pre-Registration', desc: 'Invitation-based visitor pre-auth with QR pass generation and expiry control.' },
      { title: 'ID Verification', desc: 'Document scan, facial match, and watchlist screening at arrival.' },
      { title: 'Digital Passes', desc: 'Time-bound, zone-scoped digital credentials synced to access hardware.' },
      { title: 'Guard Station UI', desc: 'Tablet-optimized front-desk and security console with photo capture.' }
    ]
  },
  {
    id: 'bms',
    code: 'BMS',
    brainsName: 'Sekyu',
    title: 'Building Management System',
    tagline: 'Intelligent infrastructure, always on.',
    color: 'from-amber-500 to-orange-500',
    accentColor: '#f59e0b',
    metric: '29%',
    metricLabel: 'average energy cost reduction',
    icon: Cpu,
    description: 'HVAC, lighting, elevators, fire safety, and energy management converge in a single supervisory control layer. Reduce energy costs, extend equipment life, and respond to incidents before tenants notice.',
    hotspots: [
      { id: 'b1', x: 28, y: 25, label: 'HVAC Automation', spec: 'Zone-level climate control with occupancy scheduling' },
      { id: 'b2', x: 74, y: 32, label: 'Energy Dashboard & Submeter', spec: 'Sub-meter energy monitoring with carbon attribution' },
      { id: 'b3', x: 52, y: 75, label: 'Fire & Life Safety Panel', spec: 'Panel integration, alarm routing & evacuation console' }
    ],
    features: [
      { title: 'HVAC Automation', desc: 'Zone-level climate control with occupancy-based scheduling and fault detection.' },
      { title: 'Energy Dashboard', desc: 'Sub-meter energy monitoring, carbon reporting, and savings attribution.' },
      { title: 'Lighting Control', desc: 'Circadian-aware scene programming with daylight harvesting integration.' },
      { title: 'Fire & Life Safety', desc: 'Panel integration, alarm routing, evacuation dashboards, and drill records.' }
    ]
  },
  {
    id: 'iot',
    code: 'IoT',
    brainsName: 'Housekeeper',
    title: 'Internet of Things',
    tagline: 'Every sensor. One command layer.',
    color: 'from-cyan-500 to-blue-500',
    accentColor: '#06b6d4',
    metric: '3.2M',
    metricLabel: 'devices managed globally',
    icon: Radio,
    description: 'Connect thousands of edge devices — smart locks, occupancy sensors, leak detectors, meters, cameras, and custom hardware — into a unified telemetry and automation backbone with sub-second latency.',
    hotspots: [
      { id: 'i1', x: 30, y: 30, label: 'Device Registry Gateway', spec: 'Centralized inventory with firmware & health telemetry' },
      { id: 'i2', x: 70, y: 35, label: 'Sub-second Sensor Bus', spec: 'MQTT & WebSocket streams with configurable retention' },
      { id: 'i3', x: 48, y: 70, label: 'ML Anomaly Detection', spec: 'Deviation alerts for energy, occupancy, and equipment' }
    ],
    features: [
      { title: 'Device Registry', desc: 'Centralized inventory of all connected hardware with firmware and health status.' },
      { title: 'Real-Time Telemetry', desc: 'Sub-second sensor streams with configurable retention and downsampling.' },
      { title: 'Automation Engine', desc: 'Trigger-condition-action rules across device types without code.' },
      { title: 'Anomaly Detection', desc: 'ML-powered deviation alerts for energy, occupancy, and equipment patterns.' }
    ]
  }
];

export default function ProductHoloStage({ onRequestDemo }) {
  const [activeSystemId, setActiveSystemId] = useState('hms');
  const [activeHotspot, setActiveHotspot] = useState(null);

  const currentSystem = coreSaasSystems.find(s => s.id === activeSystemId) || coreSaasSystems[0];

  return (
    <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
      
      {/* Stage Header with In/Out Kinetic Scroll */}
      <ScrollInOut direction="up" delay={60}>
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-fuchsia-500/40 bg-fuchsia-950/30 text-fuchsia-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Core SaaS Ecosystem // 3D Interactive Stage
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Central Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-indigo-300 to-blue-400 inline-block drop-shadow-[0_0_25px_rgba(217,70,239,0.3)]">Software Suites</span>
          </h2>
          <p className="text-indigo-200/80 text-base md:text-lg mt-3">
            Explore the 5 foundational software systems of Brains Infinite Innovations. Click hotspot pins to inspect real-time module telemetry.
          </p>
        </div>
      </ScrollInOut>

      {/* 5-Suite High-Tech Selector Bar */}
      <ScrollInOut direction="up" delay={120}>
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {coreSaasSystems.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === activeSystemId;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSystemId(s.id);
                  setActiveHotspot(null);
                }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap text-xs font-bold border cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-fuchsia-600/30 via-indigo-600/30 to-blue-600/30 border-fuchsia-400/80 text-white shadow-[0_0_25px_rgba(217,70,239,0.35)] scale-105'
                    : 'bg-[#13172e]/50 border-indigo-800/40 text-indigo-300 hover:text-white hover:border-indigo-600 hover:bg-[#1a1f3c]/60'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-fuchsia-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.6)]' : 'bg-indigo-900/50 text-indigo-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-mono tracking-wider opacity-80">{s.code}</div>
                  <div className="text-xs font-black">{s.brainsName}</div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollInOut>

      {/* Central 3D Visualizer & Feature Stage */}
      <ScrollInOut direction="up" delay={180}>
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Interactive 3D Visualizer & Hotspots */}
        <div className="lg:col-span-7">
          <Card3DTilt
            maxTilt={6}
            glowColor={currentSystem.accentColor + '33'}
            activeBorderColor={currentSystem.accentColor + 'aa'}
            active={true}
            className="h-full min-h-[480px] p-6 md:p-10 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient Radial Background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-all duration-700"
              style={{ background: `radial-gradient(circle at 50% 50%, ${currentSystem.accentColor}, transparent 70%)` }}
            />

            {/* Top Status Bar */}
            <div className="relative z-20 flex items-center justify-between border-b border-indigo-800/40 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-xs text-indigo-300 font-bold uppercase tracking-widest">
                  Live Hologram Stream // {currentSystem.code}
                </span>
              </div>
              <div className="font-mono text-xs bg-indigo-950/60 border border-indigo-700/50 px-2.5 py-1 rounded text-fuchsia-300">
                Brains Core {currentSystem.brainsName}
              </div>
            </div>

            {/* Simulated 3D Cyber Blueprint Container with Interactive Hotspots & Watermark (VR BOXXX Style) */}
            <div className="relative my-8 h-[280px] md:h-[320px] rounded-2xl bg-[#090b14]/70 border border-indigo-800/30 overflow-hidden flex items-center justify-center group cyber-grid">
              
              {/* Kinetic Watermark Typography (VR BOXXX Reference) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="text-7xl sm:text-9xl font-black font-mono tracking-widest text-white/[0.04] uppercase transform -rotate-3 transition-all duration-700 ease-out">
                  {currentSystem.code}
                </span>
              </div>

              {/* Radar Sweep Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="w-full h-full rounded-full animate-radar-sweep origin-center bg-gradient-to-tr from-transparent via-fuchsia-500/10 to-blue-500/20" />
              </div>

              {/* Central Geometric Hologram with Continuous Smooth Floating Physics */}
              <div 
                key={currentSystem.id}
                className="relative flex flex-col items-center justify-center p-6 text-center select-none z-10 pointer-events-none animate-float-fluid"
              >
                <div 
                  className="w-28 h-28 rounded-3xl border-2 flex items-center justify-center shadow-2xl transition-all duration-700 animate-morph-pulse"
                  style={{
                    borderColor: currentSystem.accentColor,
                    boxShadow: `0 0 40px ${currentSystem.accentColor}55`,
                    background: `linear-gradient(135deg, ${currentSystem.accentColor}25, rgba(19, 23, 46, 0.95))`
                  }}
                >
                  <currentSystem.icon className="w-14 h-14" style={{ color: currentSystem.accentColor }} strokeWidth={1.5} />
                </div>
                <div className="mt-4 font-mono text-sm tracking-wider font-extrabold text-white">
                  {currentSystem.title}
                </div>
                <div className="text-xs text-indigo-300/80 font-mono mt-1">
                  Brains Core "{currentSystem.brainsName}"
                </div>
              </div>

              {/* Interactive Hotspot Pins & Floating Capsule Tags (VR BOXXX Style) */}
              {currentSystem.hotspots.map((spot) => {
                const isSelected = activeHotspot?.id === spot.id;
                return (
                  <div
                    key={spot.id}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className="absolute z-30 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
                    onClick={() => setActiveHotspot(isSelected ? null : spot)}
                    onMouseEnter={() => setActiveHotspot(spot)}
                  >
                    <div className="relative flex items-center gap-2 group/spot">
                      <div className="relative flex items-center justify-center">
                        <div 
                          className="w-6 h-6 rounded-full animate-ping opacity-60 absolute"
                          style={{ backgroundColor: currentSystem.accentColor }}
                        />
                        <div 
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected ? 'scale-125 bg-white border-white shadow-[0_0_12px_#fff]' : 'bg-[#090b14]'
                          }`}
                          style={{ borderColor: currentSystem.accentColor }}
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full transition-colors"
                            style={{ backgroundColor: isSelected ? currentSystem.accentColor : '#ffffff' }}
                          />
                        </div>
                      </div>

                      {/* Floating Capsule Tag */}
                      <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border backdrop-blur-md transition-all duration-300 ${
                        isSelected 
                          ? 'bg-fuchsia-950/90 border-fuchsia-400 text-white shadow-[0_0_12px_rgba(217,70,239,0.5)] scale-105' 
                          : 'bg-[#13172e]/75 border-indigo-700/50 text-indigo-300 hover:border-indigo-400'
                      }`}>
                        <span className="text-[9px] font-mono uppercase font-bold tracking-wider">{spot.label}</span>
                        <span className="text-[9px] text-fuchsia-400">→</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Active Hotspot Expandable Callout Box */}
              {activeHotspot && (
                <div 
                  className="absolute z-40 bg-[#13172e]/95 backdrop-blur-xl border rounded-xl p-4 shadow-[0_0_35px_rgba(0,0,0,0.85)] max-w-[280px] pointer-events-auto transition-all animate-fadeIn"
                  style={{
                    left: `${Math.min(Math.max(activeHotspot.x, 22), 78)}%`,
                    top: `${activeHotspot.y < 50 ? activeHotspot.y + 12 : activeHotspot.y - 30}%`,
                    borderColor: currentSystem.accentColor,
                    transform: 'translate(-50%, 0)'
                  }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-fuchsia-300 font-bold mb-1">
                    Telemetry Node Active
                  </div>
                  <div className="text-xs font-black text-white mb-1">
                    {activeHotspot.label}
                  </div>
                  <div className="text-[11px] text-indigo-200/90 leading-tight">
                    {activeHotspot.spec}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Telemetry KPI Banner */}
            <div className="relative z-20 grid grid-cols-2 gap-4 pt-4 border-t border-indigo-800/40">
              <div className="bg-[#090b14]/60 border border-indigo-900/60 rounded-xl p-3.5">
                <div className="text-2xl md:text-3xl font-black text-white tracking-tight" style={{ color: currentSystem.accentColor }}>
                  {currentSystem.metric}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-300/80 mt-0.5">
                  {currentSystem.metricLabel}
                </div>
              </div>
              <div className="bg-[#090b14]/60 border border-indigo-900/60 rounded-xl p-3.5 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
                  <ShieldCheck className="w-4 h-4" /> Enterprise Ready
                </div>
                <div className="text-[11px] text-indigo-300/80 mt-1">
                  Sub-second sync with Supabase &amp; edge servers
                </div>
              </div>
            </div>
          </Card3DTilt>
        </div>

        {/* Right Column: Deep Feature Cards & Instant Action */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest font-bold" style={{ color: currentSystem.accentColor }}>
                SaaS System // {currentSystem.code}
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white mt-1">
                Brains <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-400">"{currentSystem.brainsName}"</span>
              </h3>
              <p className="text-violet-400 font-semibold text-sm mt-1">
                {currentSystem.tagline}
              </p>
              <p className="text-indigo-200 text-sm mt-3 leading-relaxed">
                {currentSystem.description}
              </p>
            </div>

            {/* Feature Cards with 3D Micro-interactions */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {currentSystem.features.map((feat, idx) => (
                <div 
                  key={idx}
                  className="bg-[#13172e]/60 border border-indigo-800/40 rounded-xl p-4 hover:border-fuchsia-500/60 hover:bg-[#1a1f3c]/70 transition-all duration-300 group shadow-md"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xs font-bold text-white tracking-wide">{feat.title}</h4>
                  </div>
                  <p className="text-[11px] text-indigo-300/80 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-indigo-900/50 flex flex-col sm:flex-row gap-3">
            <a
              href="/free-trial"
              className="flex-1 bg-gradient-to-r from-fuchsia-600 to-blue-600 hover:from-fuchsia-500 hover:to-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(217,70,239,0.35)] hover:shadow-[0_6px_25px_rgba(217,70,239,0.55)] active:scale-95 text-center flex items-center justify-center gap-2 text-sm"
            >
              <span>Request Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/get-started"
              className="bg-[#13172e]/80 hover:bg-[#1e244d] border border-indigo-700/60 hover:border-indigo-500 text-indigo-200 font-bold py-3.5 px-6 rounded-xl transition-all active:scale-95 text-center flex items-center justify-center gap-2 text-sm"
            >
              Deploy Module
            </a>
          </div>
        </div>

        </div>
      </ScrollInOut>
    </div>
  );
}
