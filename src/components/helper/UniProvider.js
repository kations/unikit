import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { ThemeProvider } from "styled-components";

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

export default ({ theme, children }) => {
  let width = Dimensions.get("window").width;
  let height = Dimensions.get("window").height;

  const [state, setState] = useState({ width, height });

  const defaultTheme = {
    unikit: {
      layout: {
        width: state.width,
        height: state.height
      },
      colors: {
        primary: "#FF6B87",
        success: "#4CAF50",
        text: "#FF6B87"
      },
      breaks: {
        mobile: 768,
        tablet: 1024,
        desktop: 99999
      },
      box: {
        shadowColor: "rgba(0,0,0,0.2)"
      },
      overlay: {
        backgroundColor: "#FFF"
      },
      avatar: {
        backgroundColor: "primary",
        size: 60
      },
      progress: {
        trackColor: "rgba(0,0,0,0.05)",
        circleColor: "primary"
      },
      button: {
        mode: "primary",
        colors: ["#FF6B87", "rgb(255,0,0)"],
        inline: true,
        activeOpacity: 0.6,
        size: 44,
        borderRadius: 22
      },
      switch: {
        circleSize: 25,
        borderSize: 5,
        borderRadius: 30
      },
      select: {
        mode: "primary",
        size: 60,
        height: 50,
        indicatorHeight: 50,
        borderRadius: 25
      },
      text: {
        lineHeight: 25,
        fontSize: 16
      },
      headline: {
        level: 1,
        fontSize: 50
      },
      table: {
        headBackground: "#FFF",
        bodyBackground: "primary",
        bodyBackgroundLightness: 0.96
      },
      gradient: {
        colors: ["#FF6B87", "rgb(255,0,0)"]
      }
    }
  };

  return (
    <ThemeProvider theme={mergeDeep(defaultTheme, theme)}>
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
      </View>
    </ThemeProvider>
  );
};
