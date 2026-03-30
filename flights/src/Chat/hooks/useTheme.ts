import { useState } from "react";
import { LIGHT_THEME, DARK_THEME } from "../data";
import type { ThemeVars } from "../types";

export function useTheme() {
  const [isLight, setIsLight] = useState(false);

  const theme: ThemeVars = isLight ? LIGHT_THEME : DARK_THEME;
  const toggleTheme = () => setIsLight((v) => !v);

  return { isLight, theme, toggleTheme };
}