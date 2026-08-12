"use client";

interface HeartsDisplayProps {
  hearts: number;
  max?: number;
}

export function HeartsDisplay({ hearts, max = 5 }: HeartsDisplayProps) {
  return (
    <div className="hearts-display">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`heart-icon${i >= hearts ? " lost" : ""}`}
          aria-label={i < hearts ? "heart" : "lost heart"}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
