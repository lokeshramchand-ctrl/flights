import React from "react";
import { useCounterAnimation } from "../hooks/useCounterAnimation";

interface MetricCardProps {
  title:      string;
  value:      number;
  unit?:      string;
  sub:        React.ReactNode;
  animDelay:  number; // seconds
}

/**
 * A KPI card with an animated counting number on entry.
 * Fully responsive to Light/Dark mode using CSS variables.
 */
export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, sub, animDelay }) => {
  const animated = useCounterAnimation(value, 2000, animDelay * 1000 + 300);

  return (
    <div
      className="anim-fade-up relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--bg-panel-hover)] group"
      style={{ 
        animationDelay: `${animDelay}s`,
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--card-shadow)"
      }}
    >
      {/* ── Ambient Glow ── */}
      {/* Uses your global --tool-color variable to cast a subtle, theme-aware shadow */}
      <div 
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-all duration-500 pointer-events-none opacity-40 group-hover:opacity-70" 
        style={{ background: "var(--tool-color)" }}
      />

      {/* ── Title ── */}
      <p 
        className="mb-2 text-[0.7rem] font-bold uppercase tracking-widest font-sans z-10"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </p>

      {/* ── Value & Unit ── */}
      <div className="flex items-baseline gap-2 z-10">
        <span 
          className="text-4xl md:text-5xl font-bold tracking-tighter font-sans"
          style={{ color: "var(--text-primary)" }}
        >
          {animated}
        </span>
        {unit && (
          <span 
            className="text-sm font-medium font-sans"
            style={{ color: "var(--text-muted)" }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* ── Subtitle / Trend ── */}
      <div 
        className="mt-3 flex items-center gap-2 text-xs font-medium font-sans z-10"
        style={{ color: "var(--text-secondary)" }}
      >
        {sub}
      </div>
    </div>
  );
};