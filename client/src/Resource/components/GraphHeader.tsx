import React from "react";
import { Menu } from "lucide-react";
import { ThemeToggleButton } from "../../ThemeToggleButton"; // Ensure this path matches your project!

interface GraphHeaderProps {
  onOpenSidebar?: () => void; // Optional: in case you want to reuse the mobile sidebar here
}

export const GraphHeader: React.FC<GraphHeaderProps> = ({ onOpenSidebar }) => {
  const currentPath = window.location.pathname;

  return (
    <header
      className="anim-fade-down absolute top-0 left-0 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 border-b backdrop-blur-md px-4 md:px-8 py-3 z-50 transition-colors duration-300 w-full"
      style={{
        animationDelay: "0s",
        background: "color-mix(in srgb, var(--bg-sidebar) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      {/* ── Left: Title / Branding ── */}
      <div className="flex flex-1 items-center min-w-0">
        <h1 
className="text-base sm:text-sm font-bold tracking-tight font-sans truncate drop-shadow-sm"
          style={{ color: "var(--text-primary)" }}
        >
          Resource Network
        </h1>
      </div>

      {/* ── Center: Navigation ── */}
      <div className="flex items-center justify-center w-full md:w-auto shrink-0">
        <nav
          className="flex gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl border overflow-x-auto max-w-full scrollbar-hide items-center justify-center w-full md:w-auto transition-colors duration-300"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For IE
          }}
        >
          {/* Hide webkit scrollbar */}
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
        
        {/* Drop in your global Theme Button! */}
        <ThemeToggleButton />

        {/* Mobile Menu Icon (Hidden on desktop) */}
        {onOpenSidebar && (
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
        )}
        
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