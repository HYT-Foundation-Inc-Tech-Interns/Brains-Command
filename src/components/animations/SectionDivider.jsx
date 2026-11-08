'use client';

import React from 'react';

/**
 * SectionDivider - Glowing Sci-Fi Laser Divider with Traveling Photon Beam
 * Creates a sleek, award-winning visual transition boundary between sections.
 */
export default function SectionDivider({ 
  gradient = "from-transparent via-fuchsia-500/40 to-transparent",
  accentColor = "#d946ef"
}) {
  return (
    <div className="relative w-full overflow-hidden py-4 select-none pointer-events-none">
      {/* Background Soft Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-6 blur-md opacity-30"
        style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)` }}
      />
      
      {/* Thin Laser Line */}
      <div className={`w-full h-[1px] bg-gradient-to-r ${gradient} relative`}>
        {/* Traveling Photon Light Beam */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-28 h-[2px] rounded-full animate-scroll-left"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, #ffffff, ${accentColor}, transparent)`,
            boxShadow: `0 0 12px ${accentColor}`,
            animationDuration: '8s'
          }}
        />
      </div>
    </div>
  );
}
