'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Shield, Wifi, Database, Radio, Cpu, Lock } from 'lucide-react';

/**
 * SciFiTelemetryHUD - High-Tech Cockpit Telemetry HUD
 * Inspired by QClay's "Blockchain Landing Page" (Pinterest Ref 3).
 * Provides live animated telemetry status, waveform indicators, and system throughput.
 */
export default function SciFiTelemetryHUD({ 
  systemName = "Central Command Core v2.4",
  userRole = "Operator",
  activeModulesCount = 5
}) {
  const [timeStr, setTimeStr] = useState('');
  const [ping, setPing] = useState(14);
  const [throughput, setThroughput] = useState(48.2);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Subtle simulated telemetry fluctuations
    const pingInterval = setInterval(() => {
      setPing(12 + Math.floor(Math.random() * 6));
      setThroughput((45 + Math.random() * 8).toFixed(1));
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  return (
    <div className="w-full bg-[#0b0e1d]/80 backdrop-blur-md border border-indigo-900/60 rounded-2xl px-5 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.4)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs select-none">
      
      {/* Left: Core Status with Pulsing Beacon */}
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></span>
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> {systemName}
          </span>
          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full font-semibold uppercase">
            Armed &amp; Synced
          </span>
        </div>
      </div>

      {/* Center: Live Waveform Signal Bars */}
      <div className="hidden md:flex items-center gap-2 text-indigo-300">
        <span className="text-[10px] uppercase tracking-wider text-indigo-400">Signal:</span>
        <div className="flex items-end gap-1 h-4">
          <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-2" style={{ animationDuration: '0.8s' }}></span>
          <span className="w-1 bg-fuchsia-400 rounded-full animate-pulse h-4" style={{ animationDuration: '0.6s' }}></span>
          <span className="w-1 bg-blue-400 rounded-full animate-pulse h-3" style={{ animationDuration: '1.0s' }}></span>
          <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" style={{ animationDuration: '0.7s' }}></span>
          <span className="w-1 bg-cyan-300 rounded-full animate-pulse h-2.5" style={{ animationDuration: '0.9s' }}></span>
        </div>
        <span className="text-[11px] text-white font-bold ml-1">{throughput} MB/s</span>
      </div>

      {/* Right: Metrics & Clock */}
      <div className="flex items-center gap-4 sm:gap-6 text-indigo-300 ml-auto md:ml-0">
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>{ping}ms</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Supabase</span>
          <span className="text-emerald-400 font-bold">100%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-fuchsia-400" />
          <span className="text-fuchsia-300">TLS 1.3</span>
        </div>
        {timeStr && (
          <div className="hidden lg:block text-indigo-400/80 text-[11px] border-l border-indigo-900/60 pl-4">
            {timeStr}
          </div>
        )}
      </div>

    </div>
  );
}
