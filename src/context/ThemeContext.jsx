import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('mr_portfolio_theme');
      if (stored === 'light' || stored === 'dark') return stored;
      // Also check legacy reviews theme if present
      const legacy = localStorage.getItem('mr_reviews_theme');
      if (legacy === 'light' || legacy === 'dark') return legacy;
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  // Effective theme: On HomePage, always force 'dark' per user specification:
  // "ye hmara main home page k ilawh sab pa apply ho"
  const effectiveTheme = isHomePage ? 'dark' : theme;

  useEffect(() => {
    try {
      localStorage.setItem('mr_portfolio_theme', theme);
      localStorage.setItem('mr_reviews_theme', theme);
    } catch {}

    // Apply data-theme and classes to root
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    if (effectiveTheme === 'light') {
      document.documentElement.classList.remove('theme-dark');
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
    }
  }, [theme, effectiveTheme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, toggleTheme, setTheme, isHomePage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      effectiveTheme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
      isHomePage: false,
    };
  }
  return context;
}
