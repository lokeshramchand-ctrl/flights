import React from "react";
import {
  AlertTriangle, BarChart3, Clock, Activity,
} from "lucide-react";
import type {SuggestedPrompt, ThemeVars } from "../types";

// // ─── Suggested Prompts ────────────────────────────────────────────────────────
export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { text: "Show me all delayed flights",           icon: React.createElement(AlertTriangle, { size: 14 }) },
  { text: "What's the current stand utilization?", icon: React.createElement(BarChart3,     { size: 14 }) },
  { text: "Which flights arrive in the next hour?",icon: React.createElement(Clock,          { size: 14 }) },
  // { text: "Reassign EK512 to a PLB stand",         icon: React.createElement(Plane,          { size: 14 }) },
  { text: "Show T1 capacity forecast",             icon: React.createElement(Activity,       { size: 14 }) },
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