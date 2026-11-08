'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * ScrollLetters - Staggered Kinetic Letter & Word Reveal Component
 * Splits sentences into words and characters. As they scroll into view,
 * letters lift, de-blur, and illuminate with a holographic stagger.
 * When scrolling out, they smoothly retract and re-arm for the next scroll.
 */
export default function ScrollLetters({
  text = '',
  as: Component = 'h2',
  className = '',
  stagger = 22, // ms delay per letter
  wordDelay = 40, // ms delay per word
  reTrigger = true,
  glow = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

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
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reTrigger]);

  if (!text) return null;

  // Split into words to prevent unnatural line breaks mid-word
  const words = text.split(' ');
  let charCounter = 0;

  return (
    <Component
      ref={containerRef}
      className={`inline-block ${className}`}
      style={{ perspective: '800px' }}
    >
      {words.map((word, wIdx) => {
        const letters = word.split('');
        return (
          <span
            key={wIdx}
            className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0"
            style={{ overflow: 'hidden', verticalAlign: 'baseline' }}
          >
            {letters.map((char, cIdx) => {
              const delay = charCounter * stagger + wIdx * wordDelay;
              charCounter += 1;

              return (
                <span
                  key={cIdx}
                  className="inline-block will-change-transform will-change-[filter,opacity]"
                  style={{
                    display: 'inline-block',
                    transform: isVisible || !hasMounted
                      ? 'translate3d(0, 0, 0) rotateX(0deg) scale(1)'
                      : 'translate3d(0, 110%, 0) rotateX(-50deg) scale(0.94)',
                    opacity: isVisible || !hasMounted ? 1 : 0,
                    filter: isVisible || !hasMounted
                      ? (glow ? 'drop-shadow(0 0 10px rgba(217,70,239,0.3)) blur(0px)' : 'blur(0px)')
                      : 'blur(5px)',
                    transitionDuration: '700ms',
                    transitionDelay: `${delay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
}
