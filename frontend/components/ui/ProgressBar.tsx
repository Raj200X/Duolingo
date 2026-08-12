import React from "react";
import "./ProgressBar.css";

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: "primary" | "warning";
  className?: string;
}

export function ProgressBar({ 
  progress, 
  color = "primary", 
  className = "" 
}: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`duo-progress-track ${className}`}>
      <div 
        className={`duo-progress-fill duo-progress-fill-${color}`} 
        style={{ width: `${clampedProgress}%` }}
      >
        {/* Adds the shiny highlight on the progress bar */}
        <div className="duo-progress-highlight" />
      </div>
    </div>
  );
}
