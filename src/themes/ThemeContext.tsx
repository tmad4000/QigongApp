import React, { createContext, useContext, useState } from 'react';
import { themes, DesignVariant, Theme } from './index';

interface ThemeContextType {
  variant: DesignVariant;
  theme: Theme;
  setVariant: (v: DesignVariant) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  variant: 'zen-flow',
  theme: themes['zen-flow'],
  setVariant: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<DesignVariant>('zen-flow');
  return (
    <ThemeContext.Provider value={{ variant, theme: themes[variant], setVariant }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
