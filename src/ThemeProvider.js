import React, { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components/native";
import color from "color";

const merge = require("deepmerge");

import Alert from "./Alert";
import { PortalProvider, PortalExit } from "./Portal";
import { useDimensions } from "./hooks";
import { rem } from "./util";

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
    shadow: color(primary)
      .alpha(0.1)
      .toString()
  },
  fonts: {
    h1: {
      fontSize: rem(2)
    },
    h2: {
      fontSize: rem(1.75)
    },
    h3: {
      fontSize: rem(1.5)
    },
    h4: {
      fontSize: rem(1.25)
    },
    h5: {
      fontSize: rem(1)
    },
    p: {
      fontSize: rem(1)
    },
    label: {
      fontSize: rem(0.75)
    },
    caption: {
      fontSize: rem(0.5)
    }
  },
  breaks: {
    mobile: 768,
    tablet: 1024,
    desktop: 10000
  },
  globals: {
    fontFamily: "System",
    roundness: 3,
    inputGap: 15
  }
};

export default ({
  children,
  theme = {},
  alertProps = {},
  defaultMode = "default",
  defaultWidth = 500
}) => {
  const [alert, setAlert] = useState(null);
  const dimensions = useDimensions();

  const getColors = (colors, mode) => {
    const newColors =
      mode !== "default"
        ? {
            ...colors,
            ...(colors.modes && colors.modes[mode] ? colors.modes[mode] : {})
          }
        : colors;
    return newColors;
  };

  const [defaultTheme, setTheme] = useState(() =>
    merge(
      {
        ...DefaultTheme,
        alert: obj => {
          setAlert(obj);
        },
        update: state => {
          setTheme({ ...defaultTheme, ...state });
        },
        mode: defaultMode
      },
      theme
    )
  );

  const getDimensions = (width, height) => {
    const is = {};
    let breakIndex = 0;
    let last = 0;
    Object.keys(defaultTheme.breaks).map((key, index) => {
      is[`is${capitalizeFLetter(key)}`] =
        width < defaultTheme.breaks[key] && width > last;
      if (defaultTheme.breaks[key] < width) {
        breakIndex = index;
      }
      last = defaultTheme.breaks[key];
    });
    return { width, height, ...is, breakIndex };
  };

  useEffect(() => {
    setTheme(merge(defaultTheme, theme));
  }, [theme]);

  return (
    <PortalProvider>
      <ThemeProvider
        theme={{
          ...defaultTheme,
          colors: getColors(defaultTheme.colors, defaultTheme.mode),
          ...getDimensions(
            dimensions.width || defaultWidth,
            dimensions.height || 0
          )
        }}
      >
        <Fragment>
          {children}
          <Alert alert={alert} {...alertProps} />
          <PortalExit />
        </Fragment>
      </ThemeProvider>
    </PortalProvider>
  );
};
