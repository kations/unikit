import React from 'react';
import type { BaseTheme } from './types';

import deepmerge from '../util/deepMerge';

import ThemeContext from './context';
import DefaultTheme from './theme';
import { useDimensions } from '../hooks';

const ThemeProvider = ({
  theme,
  children,
}: {
  theme: BaseTheme;
  children: React.ReactNode;
}) => {
  const { window } = useDimensions();
  const mergedTheme = deepmerge(DefaultTheme, theme);

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
