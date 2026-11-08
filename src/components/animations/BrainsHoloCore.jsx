'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Layers, Link2, Briefcase, Monitor, Sparkles, 
  RotateCw, Play, Pause, ArrowRight
} from 'lucide-react';

/**
 * BrainsHoloCore - Interactive 3D Holographic Cyber Core with Orbital Pillars
 * 
 * Key Features:
 * 1. 4 Pillar Visual Nodes (SaaS, Connectors, Agency, Hardware) represented by Images & Icons:
 *    - SaaS: /brains-logo.png + Layers icon
 *    - Connectors: /connector-logo.png + Link2 icon
 *    - Agency: /services/branding.jpg + Briefcase icon
 *    - Hardware: /Thehco.png + Monitor icon
 * 2. 3D Rotation & Orbital Animation:
 *    - The 4 satellite image pods smoothly orbit around the central core along the gyroscopic path.
 *    - Each pod features rotating concentric cyber HUD rings.
 *    - Interactive speed & pause controls: Hovering smoothly halts orbit for effortless inspection.
 *    - Dragging / mouse move dynamically steers the 3D orbital tilt.
 * 3. Radiant Central Cyber-Core:
 *    - Clean, high-tech glowing pulsar without clutter.
 *    - Interactive click pulse emits shockwave ripples across all 4 satellite nodes.
 *    - Dynamic photon laser coupling connects the core to any hovered satellite node.
 */

const PILLAR_DATA = [
  {
    id: 'saas',
    code: '01',
    label: 'SaaS Suites',
    title: 'Central Command SaaS',
    detail: 'HMS, PMS, HVMS, BMS, IoT',
    href: '#software',
    color: '#d946ef',
    glowColor: 'rgba(217, 70, 239, 0.5)',
    image: '/brains-logo.png',
    icon: Layers,
    baseAngle: -Math.PI * 0.75, // Top-Left
    imageClass: 'w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]'
  },
  {
    id: 'connector',
    code: '02',
    label: 'Connectors',
    title: 'Enterprise Bridges',
    detail: 'HR, POS, AIS, CRM, Fleet (10 Systems)',
    href: '#connector',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    image: '/connector-logo.png',
    icon: Link2,
    baseAngle: -Math.PI * 0.25, // Top-Right
    imageClass: 'w-12 h-6 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
  },
  {
    id: 'hardware',
    code: '04',
    label: 'Hardware',
    title: 'Devices & Auxiliaries',
    detail: 'Millennium 4K & THEHCO Fuel-Tech',
    href: '#hardware',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    image: '/Thehco.png',
    icon: Monitor,
    baseAngle: Math.PI * 0.25, // Bottom-Right
    imageClass: 'w-12 h-8 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
  },
  {
    id: 'agency',
    code: '03',
    label: 'Agency',
    title: 'Growth Services',
    detail: 'Branding, Web Dev, Marketing (6 Divisions)',
    href: '#services',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    image: '/services/branding.jpg',
    icon: Briefcase,
    baseAngle: Math.PI * 0.75, // Bottom-Left
    imageClass: 'w-11 h-11 object-cover rounded-full'
  }
];

export default function BrainsHoloCore() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const podRefs = useRef({});

  // Interactive State
  const [hoveredPillar, setHoveredPillar] = useState(null);
  const [isOrbiting, setIsOrbiting] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isPulsing, setIsPulsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, angle: 0 });

  // Animation values stored in refs to avoid 60fps React re-renders
  const orbitAngleRef = useRef(0);
  const currentAccentRef = useRef('#d946ef');
  const hoveredPillarRef = useRef(null);
  const isOrbitingRef = useRef(true);

  // Sync refs with state
  useEffect(() => {
    hoveredPillarRef.current = hoveredPillar;
    if (hoveredPillar) {
      const p = PILLAR_DATA.find(item => item.id === hoveredPillar);
      if (p) currentAccentRef.current = p.color;
    } else {
      currentAccentRef.current = '#d946ef';
    }
  }, [hoveredPillar]);

  useEffect(() => {
    isOrbitingRef.current = isOrbiting;
  }, [isOrbiting]);

  // Click pulse trigger
  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 800);
  };

  // Mouse drag handlers for manual 3D orbit rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      angle: orbitAngleRef.current
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const normY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x: normX * 10, y: normY * 10 });

    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.x;
      orbitAngleRef.current = dragStartRef.current.angle + deltaX * 0.008;
    }
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  // Main Render Loop (Canvas + DOM Satellite positioning)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = 540);
    let height = (canvas.height = 540);

    const resize = () => {
      if (containerRef.current) {
        const size = Math.min(containerRef.current.clientWidth, 540);
        width = canvas.width = size;
        height = canvas.height = size;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // 3D neural sphere vertices
    const points = [];
    const sphereRadius = 130;
    const totalPoints = 110;
    for (let i = 0; i < totalPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / totalPoints);
      const theta = Math.sqrt(totalPoints * Math.PI) * phi;
      points.push({
        x: sphereRadius * Math.cos(theta) * Math.sin(phi),
        y: sphereRadius * Math.sin(theta) * Math.sin(phi),
        z: sphereRadius * Math.cos(phi),
        pulse: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03
      });
    }

    let angleX = 0.25;
    let angleY = 0.35;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Update continuous orbit rotation
      if (isOrbitingRef.current && !hoveredPillarRef.current) {
        orbitAngleRef.current += 0.0035;
      }

      // Smooth inertia rotation for sphere
      angleX += 0.002;
      angleY += 0.005;

      const currentAccent = currentAccentRef.current;

      // 1. Radiant Ambient Background Aura
      const radialGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, sphereRadius * 1.6);
      radialGrad.addColorStop(0, currentAccent + '30');
      radialGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
      radialGrad.addColorStop(1, 'rgba(9, 11, 20, 0)');
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Project 3D Sphere Points
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected = [];
      for (let p of points) {
        let x1 = p.x * cosY + p.z * sinY;
        let y1 = p.y;
        let z1 = -p.x * sinY + p.z * cosY;

        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        const fov = 350;
        const scale = fov / (fov + z2);
        const px = cx + x2 * scale;
        const py = cy + y2 * scale;
        const alpha = Math.max(0.1, (z2 + sphereRadius) / (sphereRadius * 2));

        p.pulse += p.speed;
        const radius = (1.4 + Math.sin(p.pulse) * 0.7) * scale;
        projected.push({ px, py, z2, alpha, scale, radius });
      }

      // Draw neural lines
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 40) {
            const lineAlpha = (1 - dist / 40) * projected[i].alpha * 0.3;
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
            ctx.lineWidth = 0.8 * projected[i].scale;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw points
      for (let p of projected) {
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.7, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.z2 > 0 ? currentAccent : `rgba(96, 165, 250, ${p.alpha * 0.7})`;
        ctx.fill();
      }

      // 3. Draw Outer Gyroscopic Orbital Rings
      const drawRing = (tiltAngle, rotSpeed, radius, color, isDashed = false) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angleY * rotSpeed + tiltAngle);
        ctx.scale(1, 0.36 + Math.sin(angleX + tiltAngle) * 0.14);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        if (isDashed) {
          ctx.setLineDash([8, 12]);
          ctx.lineDashOffset = -frame * 0.6;
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbital photon
        const orbitAngle = frame * 0.02 * (rotSpeed > 0 ? 1 : -1);
        const ox = Math.cos(orbitAngle) * radius;
        const oy = Math.sin(orbitAngle) * radius;
        ctx.beginPath();
        ctx.arc(ox, oy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.restore();
      };

      drawRing(0, 1.2, sphereRadius * 1.35, 'rgba(56, 189, 248, 0.4)', true);
      drawRing(Math.PI / 3, -1.0, sphereRadius * 1.55, currentAccent + '66', true);
      drawRing(Math.PI / 1.5, 0.8, sphereRadius * 1.2, 'rgba(129, 140, 248, 0.35)', false);

      // 4. Calculate and Update Satellite Pod Coordinates (3D Elliptical Orbit)
      const rx = width * 0.38;
      const ry = height * 0.28;
      const activePillarId = hoveredPillarRef.current;

      PILLAR_DATA.forEach((pillar) => {
        const angle = pillar.baseAngle + orbitAngleRef.current;
        const posX = cx + Math.cos(angle) * rx;
        const posY = cy + Math.sin(angle) * ry;

        // Update DOM node position directly for 60-120fps performance
        const el = podRefs.current[pillar.id];
        if (el) {
          el.style.left = `${posX}px`;
          el.style.top = `${posY}px`;
        }

        // Draw animated laser beam from center core to the hovered satellite
        if (activePillarId === pillar.id) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(posX, posY);
          ctx.strokeStyle = pillar.color;
          ctx.lineWidth = 2.2;
          ctx.setLineDash([6, 6]);
          ctx.lineDashOffset = -frame * 1.5;
          ctx.shadowColor = pillar.color;
          ctx.shadowBlur = 14;
          ctx.stroke();
          ctx.restore();
        }
      });

      // 5. Central Pulsating Cybernetic Core
      const corePulse = Math.sin(frame * 0.06) * 5;
      const coreGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 38 + corePulse);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.35, currentAccent);
      coreGrad.addColorStop(0.7, 'rgba(59, 130, 246, 0.3)');
      coreGrad.addColorStop(1, 'rgba(9, 11, 20, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 38 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="relative flex items-center justify-center w-full max-w-[540px] aspect-square mx-auto select-none cursor-grab active:cursor-grabbing"
    >
      {/* 3D WebGL/Canvas Background Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none relative z-10"
      />

      {/* ========================================================================= */}
      {/* CENTRAL CYBER PULSAR (CLICKABLE FOR SHOCKWAVE PULSE)                      */}
      {/* ========================================================================= */}
      <div
        onClick={triggerPulse}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer flex items-center justify-center group"
        title="Central Command Holo-Core // Click to Emit Pulse"
        style={{
          transform: `translate(-50%, -50%) translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`
        }}
      >
        {/* Shockwave Expanding Ring */}
        {isPulsing && (
          <div className="absolute w-28 h-28 rounded-full border-2 border-fuchsia-400 animate-pulse-ripple pointer-events-none" />
        )}

        {/* Concentric Rotating Outer Tech Ring */}
        <div className="w-20 h-20 rounded-full border border-dashed border-fuchsia-400/60 animate-spin-slow pointer-events-none flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border border-dotted border-blue-400/60 animate-spin-slow-reverse" />
        </div>

        {/* Floating Spec Core Glow */}
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-500/80 via-white to-blue-400/80 blur-[2px] shadow-[0_0_25px_rgba(217,70,239,0.9)] group-hover:scale-125 transition-transform duration-300" />
      </div>

      {/* ========================================================================= */}
      {/* 4 ORBITING SATELLITE PODS (IMAGES & ICONS WITH ROTATION ANIMATION)         */}
      {/* ========================================================================= */}
      {PILLAR_DATA.map((pillar) => {
        const IconComponent = pillar.icon;
        const isHovered = hoveredPillar === pillar.id;

        return (
          <div
            key={pillar.id}
            ref={(el) => (podRefs.current[pillar.id] = el)}
            onMouseEnter={() => setHoveredPillar(pillar.id)}
            onMouseLeave={() => setHoveredPillar(null)}
            className="absolute z-30 transition-transform duration-200"
            style={{
              transform: 'translate(-50%, -50%)',
              zIndex: isHovered ? 50 : 30
            }}
          >
            <a
              href={pillar.href}
              className="group block relative focus:outline-none"
            >
              {/* Outer Rotating HUD Ring (Spins continuously around the image/icon) */}
              <div 
                className={`absolute -inset-2 rounded-full border border-dashed transition-all duration-300 pointer-events-none ${
                  isHovered ? 'animate-spin scale-110' : 'animate-spin-slow'
                }`}
                style={{
                  borderColor: pillar.color,
                  boxShadow: isHovered ? `0 0 25px ${pillar.color}` : 'none',
                  animationDuration: isHovered ? '4s' : '16s'
                }}
              >
                {/* Orbital Beacon Dot on Ring */}
                <span 
                  className="w-2 h-2 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"
                  style={{ backgroundColor: pillar.color, boxShadow: `0 0 8px ${pillar.color}` }}
                />
              </div>

              {/* Main Circular Hologram Pod Container */}
              <div 
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center backdrop-blur-xl border-2 transition-all duration-300 shadow-xl overflow-hidden relative ${
                  isHovered ? 'scale-115 ring-4' : 'hover:scale-105'
                }`}
                style={{
                  borderColor: pillar.color,
                  backgroundColor: 'rgba(19, 23, 46, 0.92)',
                  boxShadow: `0 0 25px ${pillar.glowColor}`
                }}
              >
                {/* Internal Specular Glass Highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />

                {/* THE IMAGE (OR ICON) DISPLAYED PROMINENTLY */}
                <div className="relative z-10 flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className={pillar.imageClass}
                  />
                </div>

                {/* Corner Mini Icon Badge */}
                <div 
                  className="absolute bottom-1 right-1 p-1 rounded-full z-20 shadow-md"
                  style={{ backgroundColor: pillar.color }}
                >
                  <IconComponent className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Pillar Title Capsule Tag (Always visible below pod) */}
              <div className="mt-1.5 flex justify-center">
                <div 
                  className={`px-2 py-0.5 rounded-full border backdrop-blur-md transition-all text-center whitespace-nowrap ${
                    isHovered 
                      ? 'bg-white text-black font-black shadow-[0_0_15px_#fff] scale-105' 
                      : 'bg-[#13172e]/90 text-indigo-200 border-indigo-800/80 hover:border-indigo-400'
                  }`}
                  style={{ borderColor: isHovered ? '#ffffff' : pillar.color + '88' }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                    {pillar.code} // {pillar.label}
                  </span>
                </div>
              </div>

              {/* Expandable Rich Cyber Hover Card */}
              {isHovered && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-[#101426]/95 backdrop-blur-xl border rounded-xl p-3 shadow-[0_0_30px_rgba(0,0,0,0.85)] z-50 pointer-events-none animate-fadeIn"
                  style={{ borderColor: pillar.color }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                      PILLAR NODE {pillar.code}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      ONLINE
                    </span>
                  </div>
                  <div className="text-xs font-black text-white mb-1">
                    {pillar.title}
                  </div>
                  <div className="text-[10px] text-indigo-200/90 leading-tight mb-2">
                    {pillar.detail}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: pillar.color }}>
                    <span>Explore Section</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </a>
          </div>
        );
      })}

      {/* Subtle Bottom Controls (Play/Pause Orbit & Tactile Hint) */}
      <div className="absolute -bottom-2 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsOrbiting(prev => !prev)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#13172e]/85 backdrop-blur-md border border-indigo-800/60 hover:border-indigo-500 text-[10px] font-mono text-indigo-300 hover:text-white transition-all shadow-md cursor-pointer"
          title="Toggle Planetary Orbit"
        >
          {isOrbiting ? (
            <>
              <Pause className="w-2.5 h-2.5 text-fuchsia-400" />
              <span>Orbiting</span>
            </>
          ) : (
            <>
              <Play className="w-2.5 h-2.5 text-emerald-400" />
              <span>Orbit Paused</span>
            </>
          )}
        </button>

        <span className="text-[9px] font-mono text-indigo-400/60 hidden sm:inline">
          // Drag to Rotate 3D
        </span>
      </div>
    </div>
  );
}
