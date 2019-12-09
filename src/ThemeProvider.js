import React, { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components/native";
import color from "color";

import Alert from "./Alert";
import { PortalProvider, PortalExit } from "./Portal";
import { useWindowDimensions } from "./hooks";

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

function capitalizeFLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const primary = "#673fb4";

const DefaultTheme = {
  colors: {
    primary: primary,
    background: color(primary)
      .alpha(0.1)
      .toString(),
    accent: "",
    text: color(primary)
      .darken(0.6)
      .toString(),
    surface: "#FFF",
    placeholder: "",
    success: "#8bc34a",
    warning: "#ffbb33",
    error: "#f44336",
    shadow: "rgba(0,0,0,0.1)"
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
    fontFamily: "System",
    borderRadius: 3,
    roundness: 5,
    inputGap: 15
  }
};

export default ({ children, theme = {}, alertProps = {} }) => {
  const [alert, setAlert] = useState(null);
  const dimensions = useWindowDimensions();
  const [defaultTheme, setTheme] = useState(() =>
    mergeDeep(
      {
        ...DefaultTheme,
        alert: obj => {
          setAlert(obj);
        }
      },
      theme
    )
  );

  const dimensionHandler = ({ width, height }) => {
    const is = {};
    let breakIndex = 0;
    Object.keys(defaultTheme.breaks).map((key, index) => {
      is[`is${capitalizeFLetter(key)}`] = defaultTheme.breaks[key] < width;
      if (defaultTheme.breaks[key] < width) {
        breakIndex = index;
      }
    });
    setTheme({
      ...defaultTheme,
      ...{ width: width, height: height, ...is, breakIndex }
    });
  };

  useEffect(() => {
    setTheme(mergeDeep(defaultTheme, theme));
  }, [theme]);

  useEffect(() => {
    if (dimensions.width !== defaultTheme.width) {
      dimensionHandler(dimensions);
    }
  }, [dimensions]);

  return (
    <PortalProvider>
      <ThemeProvider theme={defaultTheme}>
        <Fragment>
          {children}
          <Alert alert={alert} {...alertProps} />
          <PortalExit />
        </Fragment>
      </ThemeProvider>
    </PortalProvider>
  );
};
