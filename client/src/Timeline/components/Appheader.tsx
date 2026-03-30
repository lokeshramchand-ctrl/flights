import React from "react";

interface AppHeaderProps {
  hourWidth:    number;
  onZoomChange: (value: number) => void;
}

/**
 * Top navigation bar: app title, airport badge, and zoom slider.
 * Kept as a presentational component — no internal state.
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ hourWidth, onZoomChange }) => (
  <header
    className="anim-fade-down flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.04] bg-[#050505]/60 px-8 py-5 backdrop-blur-2xl z-20"
    style={{ animationDelay: "0s" }}
  >
    {/* ── Left: branding ── */}
    <div className="flex items-center gap-5">
      {/* Live indicator */}
      <div className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 duration-1000" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white">Ops Control</h1>
      <span className="hidden md:inline-flex items-center rounded-full bg-white/[0.03] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 border border-white/[0.05]">
        LHR • Terminals 1 &amp; 2
      </span>
    </div>

    {/* ── Right: zoom slider ── */}
    <div className="flex w-full md:w-auto items-center gap-4 rounded-full bg-white/[0.02] px-5 py-2.5 border border-white/[0.05] shadow-inner">
      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500">Zoom</span>
      <input
        type="range"
        min={80}
        max={240}
        value={hourWidth}
        onChange={(e) => onZoomChange(parseInt(e.target.value))}
        className="h-1 w-full md:w-40 cursor-pointer appearance-none rounded-full bg-white/[0.1] accent-blue-500 hover:accent-blue-400 transition-all"
      />
    </div>
  </header>
);