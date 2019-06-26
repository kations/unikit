import color from "color";

const primary = "#673fb4"; // "#FF6B87"

const getLightColor = (col, lum) => {
  return color(col)
    .alpha(0.1)
    .toString();
  var newColor = col;
  var luminosity = color(col).luminosity();
  while (luminosity < lum) {
    newColor = color(newColor)
      .lighten(0.1)
      .toString();
    luminosity = color(newColor).luminosity();
  }
  return newColor;
};

export default {
  colors: {
    primary: primary,
    background: getLightColor(primary, 0.66),
    accent: "",
    text: color(primary).darken(0.6),
    surface: "#FFF",
    placeholder: "",
    success: "#8bc34a",
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
    backgroundColor: "primary",
    color: "#FFF",
    inline: true,
    activeOpacity: 0.6,
    size: 44,
    invert: 0.35
  },
  switch: {
    activeBackground: "primary",
    circleSize: 25,
    borderSize: 5,
    borderRadius: 30
  },
  tabs: {
    backgroundColor: "primary",
    color: "primary",
    backgroundColorLighten: 0.35,
    indicatorColor: "primary",
    tabsHeight: 50,
    indicatorHeight: "100%",
    borderRadius: 0,
    color: "primary"
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
};
