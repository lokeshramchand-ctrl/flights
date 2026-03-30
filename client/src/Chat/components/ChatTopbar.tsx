import React from "react";
import { Sparkles, Zap, Menu } from "lucide-react";

interface ChatTopbarProps {
  onOpenSidebar: () => void;
}

export const ChatTopbar: React.FC<ChatTopbarProps> = ({ onOpenSidebar }) => (
  <div
    className="flex items-center justify-between px-4 md:px-8 py-4 border-b transition-theme shrink-0 backdrop-blur-xl z-10 sticky top-0"
    style={{ borderColor: "var(--border)", background: "var(--bg-panel)CC" }}
  >
    <div className="flex items-center gap-3 md:gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onOpenSidebar}
        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div
        className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg relative"
        style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}
      >
        <Sparkles size={16} className="text-white" />
      </div>

      {/* Title */}
      <div className="flex flex-col">
        <p className="text-[0.95rem] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Nexus Assistant
        </p>
        <p className="text-[0.7rem] font-medium" style={{ color: "var(--text-muted)" }}>
          Stand ops · LHR
        </p>
      </div>
    </div>

    {/* Online badge */}
    <div
      className="flex items-center gap-1.5 text-[0.7rem] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider"
      style={{
        borderColor: "var(--border)",
        color:       "var(--text-secondary)",
        background:  "var(--bg-surface)",
      }}
    >
      <Zap size={12} className="text-emerald-500" /> Online
    </div>
  </div>
);