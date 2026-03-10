import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { themes, DesignVariant, Theme } from './index';

// Variants the user can pick (zen-flow-light is auto-resolved, not user-facing)
export type UserVariant = Exclude<DesignVariant, 'zen-flow-light'>;

interface ThemeContextType {
  variant: DesignVariant;       // resolved variant (may be zen-flow-light)
  userVariant: UserVariant;     // what the user picked
  theme: Theme;
  setVariant: (v: UserVariant) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  variant: 'zen-flow',
  userVariant: 'zen-flow',
  theme: themes['zen-flow'],
  setVariant: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [userVariant, setUserVariant] = useState<UserVariant>('zen-flow');
  const colorScheme = useColorScheme();

  // Auto-resolve zen-flow to light variant when system is in light mode
  const resolved: DesignVariant =
    userVariant === 'zen-flow' && colorScheme === 'light'
      ? 'zen-flow-light'
      : userVariant;

  return (
    <ThemeContext.Provider
      value={{
        variant: resolved,
        userVariant,
        theme: themes[resolved],
        setVariant: setUserVariant,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
