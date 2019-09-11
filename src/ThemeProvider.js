import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { ThemeProvider } from "styled-components/native";
import color from "color";

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

const primary = "#673fb4";

const DefaultTheme = {
  colors: {
    primary: primary,
    background: "#FFF",
    accent: "",
    text: color(primary).darken(0.6),
    surface: "#FFF",
    placeholder: "",
    success: "#8bc34a",
    warning: "#ffbb33",
    error: "#f44336"
  },
  fontSize: {
    h1: 30,
    h2: 25,
    h3: 20,
    h4: 18,
    h5: 16,
    p: 16,
    caption: 10,
    label: 12
  },
  breaks: {
    mobile: 768,
    tablet: 1024,
    desktop: 99999
  },
  globals: {
    shadowColor: "rgba(0,0,0,0.5)",
    borderRadius: 3,
    roundness: 5
  }
};

export default ({ children, theme }) => {
  const [defaultTheme, setTheme] = useState(() =>
    mergeDeep(DefaultTheme, theme)
  );
  const dimensionHandler = ({ window, screen }) => {
    console.log({ window, screen });
    setTheme({ ...defaultTheme, window, screen });
  };
  useEffect(() => {
    dimensionHandler({
      window: Dimensions.get("window"),
      screen: Dimensions.get("screen")
    });
    Dimensions.addEventListener("change", dimensionHandler);
    return () => {
      Dimensions.removeEventListener("change", dimensionHandler);
    };
  }, []);
  return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
};
