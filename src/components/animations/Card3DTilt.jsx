'use client';

import React, { useRef, useState } from 'react';

/**
 * Card3DTilt - Award-winning 3D perspective card tilt with specular glare reflection
 * Inspired by Ronas IT's "Lost in Random" Game Landing Page concept (Pinterest Ref 2).
 */
export default function Card3DTilt({
  children,
  className = '',
  maxTilt = 12,
  glowColor = 'rgba(217, 70, 239, 0.25)',
  borderColor = 'rgba(129, 140, 248, 0.3)',
  activeBorderColor = 'rgba(217, 70, 239, 0.8)',
  onClick,
  active = false
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setCoords({ x, y });
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="relative transition-transform duration-200 ease-out"
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          borderColor: active ? activeBorderColor : (isHovered ? activeBorderColor : borderColor),
        }}
        className={`relative overflow-hidden rounded-2xl bg-[#13172e]/70 backdrop-blur-xl border shadow-xl ${className}`}
      >
        {/* Specular Glare Effect - Follows cursor */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 70%)`,
          }}
        />

        {/* Ambient border glow when active */}
        {active && (
          <div
            className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-75 blur-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(217,70,239,0.5), rgba(59,130,246,0.5))',
            }}
          />
        )}

        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
