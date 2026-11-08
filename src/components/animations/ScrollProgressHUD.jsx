'use client';

import React, { useState, useEffect } from 'react';

/**
 * ScrollProgressHUD - Floating Glass Scroll-Spy & Progress Indicator
 * Inspired by Apple, Linear, and Awwwards-winning websites.
 * Highlights current section, shows live scroll percentage, and provides smooth jump navigation.
 */

const sections = [
  { id: 'platform', label: 'Overview' },
  { id: 'software', label: 'SaaS Suites' },
  { id: 'connector', label: 'Connectors' },
  { id: 'services', label: 'Agency' },
  { id: 'brands', label: 'Our Brands' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'contact', label: 'Contact' },
];

export default function ScrollProgressHUD() {
  const [activeSection, setActiveSection] = useState('platform');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));

      // Only show HUD after scrolling slightly past the very top
      setIsVisible(currentScroll > 150);

      // Determine active section based on scroll position
      let current = sections[0].id;
      for (let sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            current = sec.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside 
      aria-label="Page scroll navigation"
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 transition-all duration-500 pointer-events-auto ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
      }`}
    >
      {/* Floating Glass Pill Dock */}
      <div className="bg-[#0b0e1d]/80 backdrop-blur-xl border border-indigo-800/50 rounded-full py-4 px-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col items-center gap-3.5">
        
        {/* Circular Progress Ring */}
        <div className="relative w-8 h-8 flex items-center justify-center mb-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-indigo-950"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-fuchsia-500 transition-all duration-150"
              strokeDasharray={`${scrollProgress}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute font-mono text-[9px] font-bold text-white">
            {Math.round(scrollProgress)}%
          </span>
        </div>

        {/* Section Navigation Nodes */}
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <div key={sec.id} className="relative group flex items-center">
              
              {/* Tooltip Label on Hover */}
              <div className="absolute right-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0 whitespace-nowrap bg-[#13172e]/95 backdrop-blur-md border border-indigo-700/60 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md shadow-lg">
                {sec.label}
              </div>

              {/* Clickable Nav Dot */}
              <button
                onClick={() => scrollTo(sec.id)}
                aria-label={`Scroll to ${sec.label}`}
                className={`transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'w-4 h-4 bg-gradient-to-tr from-fuchsia-500 to-blue-500 shadow-[0_0_12px_rgba(217,70,239,0.9)] scale-125'
                    : 'w-2 h-2 bg-indigo-700 hover:bg-indigo-400 hover:scale-150'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
