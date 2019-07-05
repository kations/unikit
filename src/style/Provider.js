import React, { useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { GatewayDest, GatewayProvider } from "react-gateway";
import defaultTheme from "./defaultTheme";
import { ThemeProvider } from "./Theme";
import Alert from "../components/ui/Alert";

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

const getDimensions = () => {
  if (Dimensions.get("window")) {
    const { width, height } = Dimensions.get("window");
    return { width, height };
  } else {
    return { width: 0, height: 0 };
  }
};

let key = 1;
export default ({ theme = {}, children, alertProps }) => {
  const [state, setState] = useState({
    width: getDimensions().width,
    height: getDimensions().height,
    alert: null
  });

  const enhancedDefaultTheme = Object.assign({}, defaultTheme, {
    alert: alert => {
      setState({ ...state, alert: alert });
    },
    width: state.width,
    height: state.height
  });

  return (
    <GatewayProvider>
      <ThemeProvider theme={mergeDeep(enhancedDefaultTheme, theme)}>
        <View
          style={{ flex: 1, position: "relative" }}
          onLayout={() => {
            const { width, height } = Dimensions.get("window");
            setState({ ...state, width, height });
          }}
        >
          {children}
          <GatewayDest name="unikit" component={props => <View {...props} />} />
          <Alert alert={state.alert} {...alertProps} />
        </View>
      </ThemeProvider>
    </GatewayProvider>
  );
};
