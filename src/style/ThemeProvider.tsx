import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { BaseTheme } from "./types";

import deepmerge from "../util/deepMerge";
import alertRef from "../components/Alert/ref";

import ThemeContext from "./context";
import DefaultTheme from "./theme";
import { useDimensions } from "../hooks";

export function showAlert(obj: any) {
  if (alertRef.current) {
    return alertRef.current.show(obj);
  }
}

export function hideAlert(obj: any) {
  if (alertRef.current) {
    return alertRef.current.show({ ...obj, timeout: 0 });
  }
}

const ThemeProvider = ({
  theme,
  mode,
  children,
}: {
  theme: BaseTheme;
  mode?: string;
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
    <SafeAreaProvider>
      <ThemeContext.Provider
        value={{
          ...mergedTheme,
          mode,
          width: window.width,
          height: window.height,
          alert: (a: any) => alertRef.current.show(a),
          showAlert: (a: any) => alertRef.current.show(a),
          hideAlert: (a: any) => alertRef.current.show({ ...a, timeout: 0 }),
        }}
      >
        {children}
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
};

export default ThemeProvider;
