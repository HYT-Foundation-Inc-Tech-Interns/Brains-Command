'use client';

import React, { useState } from 'react';
import { 
  Users, PieChart, Handshake, TrendingUp, ShoppingCart, 
  Package, Wallet, Truck, Navigation, KanbanSquare, Sparkles, Cpu
} from 'lucide-react';
import Card3DTilt from './Card3DTilt';
import ScrollInOut from './ScrollInOut';

/**
 * NeuralPipeline - Interactive Neural Circuit & Data Pipeline
 * Inspired by QClay's "Blockchain Landing Page" (Pinterest Ref 3).
 * Visualizes the Central Command core streaming live photon telemetry to the 10 Connector modules.
 */

const connectors = [
  { id: 'hr', name: 'Human Resources', icon: Users, metric: '100% Payroll', desc: 'Schedules, benefits, reviews, and automated payroll.' },
  { id: 'ais', name: 'Accounting (AIS)', icon: PieChart, metric: 'Live Ledger', desc: 'Real-time financial reporting, tax, and AR/AP.' },
  { id: 'crm', name: 'Customer (CRM)', icon: Handshake, metric: '3x Conversion', desc: 'Sales pipeline, tickets, and customer retention.' },
  { id: 'mis', name: 'Management Info', icon: TrendingUp, metric: '360° Visibility', desc: 'Enterprise data centralization and decision support.' },
  { id: 'pos', name: 'Point of Sale', icon: ShoppingCart, metric: '< 2s Checkout', desc: 'Terminal sync, barcode scanning, and receipting.' },
  { id: 'ims', name: 'Inventory (IMS)', icon: Package, metric: '99.9% Stock', desc: 'End-to-end supply chain, tracking from raw to sales.' },
  { id: 'ewallet', name: 'E-Wallets', icon: Wallet, metric: 'AES-256 Secure', desc: 'Contactless payments, transfers, and wallet history.' },
  { id: 'parcel', name: 'Parcel Tracking', icon: Truck, metric: 'Live GPS', desc: 'Clear journey visibility for domestic and global freight.' },
  { id: 'fleet', name: 'Fleet Command', icon: Navigation, metric: '24/7 Logistics', desc: 'Route optimization, fuel monitoring, and dispatch.' },
  { id: 'pms_proj', name: 'Project Mgmt', icon: KanbanSquare, metric: '+40% Output', desc: 'Milestones, Gantt scheduling, and resource allocation.' },
];

export default function NeuralPipeline({ onRequestTrial }) {
  const [activeNode, setActiveNode] = useState(connectors[0]);

  return (
    <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
      {/* Header */}
      <ScrollInOut direction="up" delay={60}>
        <div className="text-center max-w-4xl mx-auto mb-14">
          <img 
            src="/connector-logo.png" 
            alt="Connector Ecosystem" 
            className="h-16 md:h-20 w-auto mx-auto mb-6 object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.35)]" 
          />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/40 bg-blue-950/30 text-blue-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            Neural Pipeline &amp; Connector Matrix
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            One Central Core. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-fuchsia-400 inline-block drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">10 Unified Ecosystems.</span>
          </h2>
          <p className="text-indigo-200/80 text-base md:text-lg mt-3">
            Synchronize every critical department through high-speed API telemetry. Click any node to inspect real-time bridging capabilities.
          </p>
        </div>
      </ScrollInOut>

      {/* Main Interactive Circuit Cockpit */}
      <ScrollInOut direction="up" delay={160}>
        <div className="grid lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: 10 Bento Matrix Nodes with 3D Tilt */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {connectors.map((conn) => {
            const Icon = conn.icon;
            const isSelected = activeNode.id === conn.id;
            return (
              <Card3DTilt
                key={conn.id}
                maxTilt={10}
                active={isSelected}
                onClick={() => setActiveNode(conn)}
                className={`p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[150px] ${
                  isSelected 
                    ? 'bg-gradient-to-br from-indigo-900/60 to-blue-900/40 border-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-[#13172e]/50 border-indigo-900/40 hover:border-indigo-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-indigo-950/60 text-indigo-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white tracking-tight line-clamp-1">{conn.name}</div>
                  <div className="text-[10px] font-mono text-blue-300/80 mt-1 uppercase font-semibold">{conn.metric}</div>
                </div>
              </Card3DTilt>
            );
          })}
        </div>

        {/* Right: Selected Node Telemetry HUD Cockpit */}
        <div className="lg:col-span-4">
          <Card3DTilt
            maxTilt={6}
            active={true}
            activeBorderColor="rgba(59, 130, 246, 0.7)"
            glowColor="rgba(59, 130, 246, 0.2)"
            className="p-8 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-400/50 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <activeNode.icon className="w-7 h-7" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                    Telemetry Stream Active
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {activeNode.name}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-indigo-200/90 leading-relaxed border-b border-indigo-800/40 pb-6">
                {activeNode.desc}
              </p>

              {/* Real-time Telemetry Spec Chips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#090b14]/70 border border-indigo-900/60 font-mono text-xs">
                  <span className="text-indigo-400">Target Efficiency</span>
                  <span className="text-emerald-400 font-bold">{activeNode.metric}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#090b14]/70 border border-indigo-900/60 font-mono text-xs">
                  <span className="text-indigo-400">Data Bus Latency</span>
                  <span className="text-blue-300 font-bold">&lt; 14ms (Sub-second)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#090b14]/70 border border-indigo-900/60 font-mono text-xs">
                  <span className="text-indigo-400">Security Encryption</span>
                  <span className="text-fuchsia-400 font-bold">TLS 1.3 + AES-256</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => onRequestTrial && onRequestTrial(activeNode.name)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.35)] active:scale-95 cursor-pointer text-sm"
                >
                  Request {activeNode.name} Trial
                </button>
              </div>
            </div>
          </Card3DTilt>
        </div>

        </div>
      </ScrollInOut>
    </div>
  );
}
