import * as React from 'react';
import { ThemeProvider as TP } from 'styled-components/native';

const merge = require('deepmerge');

import defaultTheme from './defaultTheme';
import alertRef from '../components/Alert/ref';
import Portal from '../components/Portal';
import { useDimensions } from '../hooks';

export const ThemeContext = React.createContext({
  colors: {},
  spacing: {},
  breakpoints: {},
  fonts: {},
  globals: {},
});

export const ThemeProvider = ({
  theme,
  mode,
  children,
  onFeedback,
}: {
  theme: BaseTheme;
  mode: string;
  children: React.ReactNode;
  onFeedback: void;
}) => {
  const { window, screen } = useDimensions();
  const mergedTheme = React.useMemo(() => {
    const merged = merge(
      {
        ...defaultTheme,
      },
      theme
    );
    if (mode && merged.colors.modes[mode]) {
      merged.colors = merge(merged.colors, merged.colors.modes[mode]);
    }
    return merged;
  }, [theme, mode]);
  return (
    <TP
      theme={{
        ...mergedTheme,
        alert: (a: object) => alertRef.current.show(a),
        onFeedback,
        width: window.width,
        height: window.height,
      }}
    >
      <Portal.Host>{children}</Portal.Host>
    </TP>
  );
};
