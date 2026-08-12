"use client";

import { useEffect, useState } from "react";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
}

const HeartSVG = ({ filled, shaking }: { filled: boolean; shaking: boolean }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    className={shaking ? "animate-shake" : ""}
    style={{ transition: "all 0.3s ease" }}
  >
    <path 
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
      fill={filled ? "var(--status-error)" : "var(--bg-surface)"}
      stroke={filled ? "var(--status-error-hover)" : "var(--border-strong)"}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Shine effect for filled hearts */}
    {filled && (
      <path 
        d="M6 7.5c0-1.5 1-2.5 2.5-2.5" 
        stroke="rgba(255,255,255,0.5)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        fill="none" 
      />
    )}
  </svg>
);

export function HeartsDisplay({ hearts, maxHearts = 5 }: HeartsDisplayProps) {
  const [prevHearts, setPrevHearts] = useState(hearts);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (hearts < prevHearts) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timer);
    }
    setPrevHearts(hearts);
  }, [hearts, prevHearts]);

  return (
    <div className="flex items-center gap-1 font-bold" style={{ color: "var(--status-error)", fontSize: 20 }}>
      {/* 
        If the user has > 5 hearts (e.g. infinite or purchased), we just show a number.
        Otherwise, show individual pips. 
      */}
      {maxHearts <= 5 ? (
        <div className="flex gap-1 items-center">
          {Array.from({ length: maxHearts }).map((_, i) => {
            const isFilled = i < hearts;
            // The specific heart that just broke is the one at index `hearts` (0-indexed)
            const justBroke = isAnimating && i === hearts;
            return <HeartSVG key={i} filled={isFilled} shaking={justBroke} />;
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <HeartSVG filled={hearts > 0} shaking={isAnimating} />
          <span>{hearts}</span>
        </div>
      )}
    </div>
  );
}
