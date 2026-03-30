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
 * The ambient glow blob is decorative only (pointer-events: none).
 */
export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, sub, animDelay }) => {
  const animated = useCounterAnimation(value, 2000, animDelay * 1000 + 300);

  return (
    <div
      className="anim-fade-up relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)]"
      style={{ animationDelay: `${animDelay}s` }}
    >
      {/* Ambient glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 pointer-events-none" />

      <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-widest text-gray-400 font-sans z-10">
        {title}
      </p>

      <div className="flex items-baseline gap-2 z-10">
        <span className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-sans">
          {animated}
        </span>
        {unit && (
          <span className="text-sm font-medium text-gray-400 font-sans">{unit}</span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-400 font-sans z-10">
        {sub}
      </div>
    </div>
  );
};