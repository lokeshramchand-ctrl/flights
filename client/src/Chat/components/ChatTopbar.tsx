import React from "react";
import { Menu, Sun, Moon } from "lucide-react";

interface ChatTopbarProps {
  onOpenSidebar: () => void;
  isLight: boolean;
  onToggleTheme: () => void;
}

export const ChatTopbar: React.FC<ChatTopbarProps> = ({ 
  onOpenSidebar, 
  isLight, 
  onToggleTheme 
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
      {/* Guarantees the center nav stays perfectly dead-center on desktop */}
      <div className="hidden md:flex flex-1 min-w-0" />

      {/* ── Center: Navigation ── */}
      <div className="flex items-center justify-center w-full md:w-auto shrink-0">
        <nav
          className="flex gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl border overflow-x-auto max-w-full scrollbar-hide items-center justify-center w-full md:w-auto"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For IE
          }}
        >
          {/* Hide webkit scrollbar via inline style injection or global css */}
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

      {/* ── Right: Actions (Theme Toggle & Mobile Menu) ── */}
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-3 w-full md:w-auto min-w-0">
        
        {/* Theme Toggle Button (Matches AppHeader size) */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 shadow-sm"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          aria-label="Toggle Theme"
        >
          {isLight ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Mobile Menu Icon (Hidden on desktop) */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 shadow-sm"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          aria-label="Open Sidebar"
        >
          <Menu size={18} />
        </button>
        
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