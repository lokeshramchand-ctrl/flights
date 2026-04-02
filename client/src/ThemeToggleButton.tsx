import React from "react";
import { Sun, Moon } from "lucide-react";
import { useGlobalTheme } from "./ThemeProvider"; // Adjust path if needed

interface ThemeToggleButtonProps {
  className?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ className = "" }) => {
  const { isLight, toggleTheme } = useGlobalTheme();

  return (
    <button 
      onClick={toggleTheme}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm shrink-0 ${className}`}
      style={{
        background: "var(--bg-surface)", 
        borderColor: "var(--border)",
        color: "var(--text-primary)",
      }}
      aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {isLight ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};