import React from "react";
import { ThemeToggleButton } from "../../ThemeToggleButton";

interface AppHeaderProps {
  hourWidth: number;
  onZoomChange: (value: number) => void;
  isLight: boolean;
  onToggleTheme: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  hourWidth, 
  onZoomChange,
}) => {
  const currentPath = window.location.pathname;

  return (
    <header
      className="anim-fade-down flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 border-b backdrop-blur-md px-4 md:px-8 py-3 z-40 transition-colors duration-300 sticky top-0 w-full"
      style={{
        animationDelay: "0s",
        background: "color-mix(in srgb, var(--bg-sidebar) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      {/* ── Left: Empty Spacer ── */}
      {/* This invisible block takes up equal space as the right block to guarantee the center nav is perfectly dead-center on desktop */}
      <div className="hidden md:flex flex-1 min-w-0" />

      {/* ── Center: Navigation ── */}
      <div className="flex items-center justify-center w-full md:w-auto shrink-0">
        <nav
          className="flex gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl border overflow-x-auto max-w-full scrollbar-hide items-center justify-center w-full md:w-auto"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE
          }}
        >
          <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
          
          <NavButton href="/timeline" currentPath={currentPath}>
            Gantt
          </NavButton>
          <NavButton href="/chat" currentPath={currentPath}>
            Chat
          </NavButton>
          <NavButton href="/resource-graph" currentPath={currentPath}>
            Resource Graph
          </NavButton>
        </nav>
      </div>

      {/* ── Right: Controls (Zoom & Theme) ── */}
      <div className="flex flex-1 items-center justify-between md:justify-end gap-2 md:gap-3 w-full md:w-auto min-w-0">
        
        {/* Zoom slider */}
        <div
          className="flex w-full md:w-auto items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border transition-all duration-200 shadow-sm"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          <span 
            className="text-[0.65rem] sm:text-[0.75rem] font-bold uppercase tracking-wider shrink-0" 
            style={{ color: "var(--text-muted, var(--text-secondary))" }}
          >
            Zoom
          </span>
          <input
            type="range"
            min={80}
            max={240}
            value={hourWidth}
            onChange={(e) => onZoomChange(parseInt(e.target.value))}
            className="h-1.5 w-full md:w-32 lg:w-40 cursor-pointer appearance-none rounded-full accent-blue-500 hover:accent-blue-400 active:accent-blue-300 transition-all duration-150 outline-none"
            style={{
              background: "var(--border)", 
            }}
          />
        </div>

       <ThemeToggleButton />
      </div>
    </header>
  );
};

// ── Reusable Nav Button ──
interface NavButtonProps {
  href: string;
  currentPath: string;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ href, currentPath, children }) => {
  const isActive = currentPath === href;

  return (
    <button
      onClick={() => (window.location.href = href)}
      className={`
        whitespace-nowrap px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-[0.85rem] font-medium transition-all duration-200 shrink-0 flex-1 md:flex-none
        ${isActive ? "shadow-sm" : "hover:-translate-y-0.5 hover:shadow-sm active:scale-95"}
      `}
      style={{
        background: isActive ? "var(--bg-sidebar)" : "transparent",
        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
        border: isActive ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      {children}
    </button>
  );
};