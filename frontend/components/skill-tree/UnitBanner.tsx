"use client";

import type { Unit } from "@/types";
import { Button } from "../ui/Button";
import "./UnitBanner.css";
import { BookOpen } from "lucide-react";

interface UnitBannerProps {
  unit: Unit;
  index: number;
}

export function UnitBanner({ unit, index }: UnitBannerProps) {
  // Use a fallback color if not provided
  const bgColor = unit.color_hex || "var(--brand-primary)";

  return (
    <div className="unit-banner-container" style={{ backgroundColor: bgColor }}>
      <div className="unit-banner-content">
        <div className="unit-banner-text">
          <h2 className="unit-banner-title">Unit {index + 1}</h2>
          <h3 className="unit-banner-subtitle">{unit.title}</h3>
          {unit.description && (
            <p className="unit-banner-desc">{unit.description}</p>
          )}
        </div>
        
        <Button variant="ghost" className="unit-banner-btn" style={{ color: bgColor }}>
          <BookOpen size={20} strokeWidth={2.5} />
          <span className="unit-banner-btn-text">Guidebook</span>
        </Button>
      </div>
    </div>
  );
}
