import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'sunflower' | 'honey' | 'sunset' | 'sage' | 'sky';

interface ThemeContextType {
  theme: ThemeMode;
  accent: AccentColor;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('keerthika_theme') as ThemeMode) || 'light';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    return (localStorage.getItem('keerthika_accent') as AccentColor) || 'sunflower';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateDarkMode = () => {
      const dark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      setIsDark(dark);
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateDarkMode();
    mediaQuery.addEventListener('change', updateDarkMode);
    return () => mediaQuery.removeEventListener('change', updateDarkMode);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    // Remove previous theme class
    root.classList.remove('theme-sunflower', 'theme-honey', 'theme-sunset', 'theme-sage', 'theme-sky');
    root.classList.add(`theme-${accent}`);
  }, [accent]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('keerthika_theme', newTheme);
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem('keerthika_accent', newAccent);
  };

  return (
    <ThemeContext.Provider value={{ theme, accent, isDark, setTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
