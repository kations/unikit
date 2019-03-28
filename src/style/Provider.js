import React, { useState } from "react";
import { View, Dimensions } from "react-native-web";
import { GatewayDest, GatewayProvider } from "react-gateway";
import defaultTheme from "./defaultTheme";
import { ThemeProvider } from "./Theme";

export function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

export default ({ theme = {}, children }) => {
  let width = Dimensions.get("window").width;
  let height = Dimensions.get("window").height;

  const [state, setState] = useState({ width, height });

  return (
    <GatewayProvider>
      <ThemeProvider
        theme={{
          layout: { width: state.state, height: state.height },
          ...mergeDeep(defaultTheme, theme)
        }}
      >
        <View
          style={{ flex: 1 }}
          onLayout={({ nativeEvent }) => {
            setState({
              width: nativeEvent.layout.width,
              height: nativeEvent.layout.height
            });
          }}
        >
          {children}
          <GatewayDest name="unikit" component={View} />
        </View>
      </ThemeProvider>
    </GatewayProvider>
  );
};
