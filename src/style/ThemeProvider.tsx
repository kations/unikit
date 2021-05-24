import React from 'react';
import type { BaseTheme } from './types';

import deepmerge from '../util/deepMerge';

import ThemeContext from './context';
import DefaultTheme from './theme';
import { useDimensions } from '../hooks';

const ThemeProvider = ({
  theme,
  mode,
  children,
}: {
  theme: BaseTheme;
  children: React.ReactNode;
}) => {
  const { window } = useDimensions();
  const mergedTheme = React.useMemo(() => {
    const merged = deepmerge(DefaultTheme, theme);
    if (mode && merged.colors.modes[mode]) {
      merged.colors = deepmerge(merged.colors, merged.colors.modes[mode]);
    }
    return merged;
  }, [theme, mode]);

  return (
    <ThemeContext.Provider
      value={{
        width: window.width,
        height: window.height,
        ...mergedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
