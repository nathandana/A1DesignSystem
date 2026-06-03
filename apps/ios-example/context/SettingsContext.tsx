import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';
import type { A1ThemeKey, ColorMode, TypeScaleKey } from '@gtivr4/a1-design-system-react-native';

interface SettingsValue {
  colorMode:    ColorMode;
  themeKey:     A1ThemeKey;
  typeScale:    TypeScaleKey;
  setColorMode: (m: ColorMode)    => void;
  setThemeKey:  (k: A1ThemeKey)   => void;
  setTypeScale: (s: TypeScaleKey) => void;
}

const SettingsContext = createContext<SettingsValue>({
  colorMode: 'system',
  themeKey:  'base',
  typeScale: 'md',
  setColorMode: () => {},
  setThemeKey:  () => {},
  setTypeScale: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>('system');
  const [themeKey,  setThemeKey]  = useState<A1ThemeKey>('base');
  const [typeScale, setTypeScale] = useState<TypeScaleKey>('md');

  return (
    <SettingsContext.Provider value={{
      colorMode, themeKey, typeScale,
      setColorMode, setThemeKey, setTypeScale,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

/** Resolves the effective isDark flag from the stored colorMode */
export function useIsDark(colorMode: ColorMode): boolean {
  if (colorMode === 'dark')  return true;
  if (colorMode === 'light') return false;
  return Appearance.getColorScheme() === 'dark';
}
