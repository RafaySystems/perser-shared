// Copyright The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from 'react';
import { TooltipProvider } from '../ui/tooltip';
import { type PaletteMode } from './theme';

interface ThemeContextValue {
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  mode: 'light',
  setMode: () => undefined,
});

export interface PersesThemeProviderProps {
  mode?: PaletteMode;
  onModeChange?: (mode: PaletteMode) => void;
  children: React.ReactNode;
}

/**
 * Replaces MUI ThemeProvider. Applies the CSS-variable-based colour scheme via
 * `data-theme` on a wrapper element and provides the current mode through
 * context. Import `globals.css` once at the app root to activate CSS vars.
 */
export function PersesThemeProvider({ mode = 'light', onModeChange, children }: PersesThemeProviderProps) {
  const [currentMode, setCurrentMode] = React.useState<PaletteMode>(mode);

  React.useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleModeChange = React.useCallback(
    (newMode: PaletteMode) => {
      setCurrentMode(newMode);
      onModeChange?.(newMode);
    },
    [onModeChange]
  );

  return (
    <ThemeContext.Provider value={{ mode: currentMode, setMode: handleModeChange }}>
      <TooltipProvider>
        <div data-theme={currentMode} className={currentMode === 'dark' ? 'dark' : ''} style={{ display: 'contents' }}>
          {children}
        </div>
      </TooltipProvider>
    </ThemeContext.Provider>
  );
}

/** Drop-in replacement for MUI's useTheme() */
export function useChartsTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}

/** Returns 'light' | 'dark' — use this instead of theme.palette.mode */
export function usePaletteMode(): PaletteMode {
  return React.useContext(ThemeContext).mode;
}
