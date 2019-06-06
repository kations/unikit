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

let key = 1;
export default ({ theme = {}, children }) => {
  let width = Dimensions.get("window").width;
  let height = Dimensions.get("window").height;

  const [state, setState] = useState({
    width,
    height,
    alert: null
  });

  // useEffect(() => {

  // }, [])

  // setInterval(() => {
  //   const alerts = state.alerts;
  //   alerts.push({ key: key++, message: "yolo" });
  //   setState({
  //     ...state,
  //     alerts: alerts
  //   });
  // }, 5000);

  const enhancedDefaultTheme = Object.assign({}, defaultTheme, {
    alert: alert => {
      setState({ ...state, alert: alert });
    }
  });

  return (
    <GatewayProvider>
      <ThemeProvider theme={mergeDeep(enhancedDefaultTheme, theme)}>
        <View style={{ flex: 1, position: "relative" }}>
          {children}
          <GatewayDest name="unikit" component={View} />
          <Alert alert={state.alert} />
        </View>
      </ThemeProvider>
    </GatewayProvider>
  );
};
