import React from "react";
import {
  AlertTriangle, BarChart3, Clock, Plane, Activity,
} from "lucide-react";
import type { Message, StructuredCard, SuggestedPrompt, ThemeVars } from "../types";
// ─── Seed Conversation ────────────────────────────────────────────────────────
export const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    role: "user",
    content: "What's the current stand utilization for Terminal 1?",
  },
  {
    id: "msg-2",
    role: "tool",
    tool_name: "fetch_stand_status",
    duration: "0.3s",
    content: "T1: 4/5 stands occupied (80%). A1-05 available (remote).",
  },
  {
    id: "msg-3",
    role: "assistant",
    content:
      "Terminal 1 currently has 4 out of 5 stands occupied — that's 80% utilization. The only available stand is A1-05, which is a remote stand (no PLB). All contact stands with passenger loading bridges are currently in use.\n\nThe next stand to free up will be A1-01 at approximately 08:45 when EK203 completes turnaround.",
  },
  {
    id: "msg-4",
    role: "user",
    content: "QR501 is showing delayed. Can it still go to A1-01?",
  },
  {
    id: "msg-5",
    role: "tool",
    tool_name: "check_assignment_feasibility",
    duration: "0.6s",
    content:
      "QR501 ETA revised to 10:40. A1-01 clear from 08:45. B777-300ER compatible with A1-01 (max size F). No conflict detected.",
  },
  {
    id: "msg-6",
    role: "assistant",
    showCard: true,
    content:
      "Yes, QR501 can still use A1-01. Even with the 25-minute delay (revised ETA 10:40), there's a comfortable 2-hour buffer after EK203 clears the stand at 08:45.\n\nA1-01 supports up to Code F aircraft, so the B777-300ER has no size issues. No conflicts with adjacent stands either — A1-02 has BA107 departing at 09:15, well before QR501 arrives.\n\nWant me to confirm this assignment or check alternatives?",
  },
];

// ─── Flight Card Data ─────────────────────────────────────────────────────────
export const CARD_DATA: StructuredCard = {
  flight: "QR501",
  status: "Delayed",
  aircraft: "B777-300ER",
  stand: "A1-01",
  eta: "10:40 Z",
  conflict: "Clear",
};

// ─── Suggested Prompts ────────────────────────────────────────────────────────
export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { text: "Show me all delayed flights",           icon: React.createElement(AlertTriangle, { size: 14 }) },
  { text: "What's the current stand utilization?", icon: React.createElement(BarChart3,     { size: 14 }) },
  { text: "Which flights arrive in the next hour?",icon: React.createElement(Clock,          { size: 14 }) },
  { text: "Reassign EK512 to a PLB stand",         icon: React.createElement(Plane,          { size: 14 }) },
  { text: "Show T1 capacity forecast",             icon: React.createElement(Activity,       { size: 14 }) },
];

// ─── Live Telemetry Stats ─────────────────────────────────────────────────────
export const TELEMETRY_STATS = [
  { label: "T1 Util.",    value: "80%", accent: "text-amber-500"   },
  { label: "Conflicts",   value: "0",   accent: "text-emerald-500" },
  { label: "Arrivals/2h", value: "4",   accent: "text-blue-500"    },
  { label: "PLB Usage",   value: "71%", accent: "text-purple-500"  },
];

// ─── Themes ───────────────────────────────────────────────────────────────────
export const LIGHT_THEME: ThemeVars = {
  "--bg-sidebar":      "#f4f4f5",
  "--bg-panel":        "#ffffff",
  "--bg-panel-hover":  "#f8f8f8",
  "--bg-surface":      "#ffffff",
  "--border":          "#e4e4e7",
  "--text-primary":    "#09090b",
  "--text-secondary":  "#52525b",
  "--text-muted":      "#a1a1aa",
  "--msg-user-bg":     "#09090b",
  "--msg-user-text":   "#ffffff",
  "--tool-color":      "#7e22ce",
  "--tool-bg":         "#faf5ff",
  "--tool-border":     "#e9d5ff",
  "--card-bg":         "#ffffff",
  "--card-shadow":     "0 10px 30px -10px rgba(0,0,0,0.08)",
};

export const DARK_THEME: ThemeVars = {
  "--bg-sidebar":      "#09090b",
  "--bg-panel":        "#000000",
  "--bg-panel-hover":  "#18181b",
  "--bg-surface":      "rgba(255,255,255,0.03)",
  "--border":          "rgba(255,255,255,0.08)",
  "--text-primary":    "#f4f4f5",
  "--text-secondary":  "#a1a1aa",
  "--text-muted":      "#71717a",
  "--msg-user-bg":     "#f4f4f5",
  "--msg-user-text":   "#000000",
  "--tool-color":      "#c084fc",
  "--tool-bg":         "rgba(168,85,247,0.05)",
  "--tool-border":     "rgba(168,85,247,0.15)",
  "--card-bg":         "rgba(255,255,255,0.02)",
  "--card-shadow":     "0 20px 40px -20px rgba(0,0,0,0.8)",
};