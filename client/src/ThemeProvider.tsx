import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  isLight: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check local storage on initial load
  const [isLight, setIsLight] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "light" : true; 
  });

  // Apply the CSS class to the <html> tag whenever the state changes
  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    }
  }, [isLight]);

  const toggleTheme = () => setIsLight((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useGlobalTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useGlobalTheme must be used within a ThemeProvider");
  }
  return context;
};