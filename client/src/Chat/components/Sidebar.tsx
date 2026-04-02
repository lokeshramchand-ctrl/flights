import React from "react";
import { Radio, X, ChevronRight } from "lucide-react";
import { SUGGESTED_PROMPTS } from "../data";

interface SidebarProps {
  isOpen:       boolean;
  onClose:      () => void;
  onSendPrompt: (text: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSendPrompt,
}) => (
  <>
    {/* Mobile overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
        onClick={onClose}
      />
    )}

    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[280px] lg:w-[320px] transform flex flex-col gap-6 p-5 lg:p-6 shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] md:relative md:z-0 md:translate-x-0 border-r ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ background: "var(--bg-sidebar)", borderColor: "var(--border)" }}
    >
      {/* ── Header ── */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"
              style={{ animation: "pulse-dot 2s infinite" }}
            />
            <Radio size={18} className="text-emerald-500" />
            Flights
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center border md:hidden"
            style={{
              background:  "var(--bg-surface)",
              borderColor: "var(--border)",
              color:       "var(--text-primary)",
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Suggested prompts ── */}
      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto scrollbar-hide pb-4">
        <div
          className="text-[0.65rem] font-bold uppercase tracking-widest mb-1 pl-1"
          style={{ color: "var(--text-muted)" }}
        >
          Suggested Queries
        </div>

        {SUGGESTED_PROMPTS.map(({ text, icon }, i) => (
          <button
            key={text}
            onClick={() => onSendPrompt(text)}
            className="prompt-enter flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left text-[0.85rem] font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 group backdrop-blur-sm"
            style={{
              animationDelay: `${0.2 + i * 0.08}s`,
              background:     "var(--bg-surface)",
              borderColor:    "var(--border)",
              color:          "var(--text-secondary)",
            }}
          >
            <span className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                {icon}
              </span>
              {text}
            </span>
            <ChevronRight
              size={14}
              className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
            />
          </button>
        ))}
      </div>
    </aside>
  </>
);