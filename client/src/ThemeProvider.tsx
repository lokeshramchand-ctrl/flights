import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  isLight: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check local storage so the app remembers the user's preference on reload
  const [isLight, setIsLight] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "light" : true; 
  });

  // Whenever isLight changes, update the DOM and save to localStorage
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

// Custom hook to use the theme anywhere
export const useGlobalTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useGlobalTheme must be used within a ThemeProvider");
  }
  return context;
};