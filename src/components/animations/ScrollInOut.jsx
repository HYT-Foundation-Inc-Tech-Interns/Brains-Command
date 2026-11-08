'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * ScrollInOut - Bidirectional scroll-triggered component animation
 * Animates elements IN when entering the viewport, and OUT when exiting.
 */
export default function ScrollInOut({
  children,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade'
  delay = 0,
  duration = 850,
  threshold = 0.12,
  rootMargin = '-40px 0px -40px 0px',
  className = '',
  reTrigger = true,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
    const node = domRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    // Check if initial scroll position already contains the element
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else if (reTrigger) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reTrigger]);

  const getTransform = () => {
    if (!hasMounted) return 'none';
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';

    switch (direction) {
      case 'up':
        return 'translate3d(0, 48px, 0) scale(0.97)';
      case 'down':
        return 'translate3d(0, -48px, 0) scale(0.97)';
      case 'left':
        return 'translate3d(50px, 0, 0) scale(0.97)';
      case 'right':
        return 'translate3d(-50px, 0, 0) scale(0.97)';
      case 'zoom':
        return 'scale(0.9)';
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible || !hasMounted ? 1 : 0,
        transform: getTransform(),
        filter: isVisible || !hasMounted ? 'blur(0px)' : 'blur(6px)',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  );
}
