import * as React from 'react';
import { ThemeProvider as TP } from 'styled-components/native';

export function deepmerge(target, source) {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = deepmerge(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
}

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

export function showAlert(obj) {
  if (alertRef.current) {
    return alertRef.current.show(obj);
  }
}

export function hideAlert(obj) {
  if (alertRef.current) {
    return alertRef.current.show({ ...obj, timeout: 0 });
  }
}

export const ThemeProvider = ({ theme, mode, children, onFeedback }) => {
  const { window, screen } = useDimensions();
  const mergedTheme = React.useMemo(() => {
    const merged = deepmerge(defaultTheme, theme);
    if (mode && merged.colors.modes[mode]) {
      merged.colors = deepmerge(merged.colors, merged.colors.modes[mode]);
    }
    return merged;
  }, [theme, mode]);
  return (
    <TP
      theme={{
        ...mergedTheme,
        alert: (a) => alertRef.current.show(a),
        showAlert: (a) => alertRef.current.show(a),
        hideAlert: (a) => alertRef.current.show({ ...a, timeout: 0 }),
        onFeedback,
        width: window.width,
        height: window.height,
        mode,
      }}
    >
      <Portal.Host>{children}</Portal.Host>
    </TP>
  );
};
