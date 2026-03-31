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

      {/* Navbar buttons */}
      <nav className="flex gap-3">
        <button
          className="px-4 py-2 rounded-full bg-black-500 text-white font-medium hover:bg-blue-400 transition-all"
          onClick={() => window.location.href = "/timeline"}
        >
          Gnatt
        </button>
        <button
          className="px-4 py-2 rounded-full bg-black-500 text-white font-medium hover:bg-blue-400 transition-all"
          onClick={() => window.location.href = "/chat"}
        >
          Chat
        </button>
        <button
          className="px-4 py-2 rounded-full bg-black-500 text-white font-medium hover:bg-blue-400 transition-all"
          onClick={() => window.location.href = "/resource-graph"}
        >
          Resource Graph
        </button>
      </nav>
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