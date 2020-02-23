import color from "color";
import { Dimensions, Platform, PixelRatio } from "react-native";

const get = require("get-value");
const set = require("set-value");

export function rem(value) {
  if (Platform.OS === "web") return `${value}rem`;
  return PixelRatio.getFontScale() * 16 * value;
}

export function em(value) {
  if (Platform.OS === "web") return `${value}em`;
  return rem(value);
}

export const setObjValue = (obj, path, value) => {
  return set(obj, path, value);
};

export const getObjValue = (obj, path) => {
  return get(obj, path);
};

export const isDark = colorString => {
  if (isColor(colorString)) {
    const { r, g, b } = color(colorString)
      .rgb()
      .object();
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 180 ? true : false;
  } else {
    return false;
  }
};

export const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const isIphoneX = () => {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};

export const getProgress = (a, b, v) => {
  return (v - a) / (b - a);
};

export const getValueByProgress = (start, end, t) => {
  return start * (1 - t) + end * t;
};

const interpolate = (min, max, value) => {
  var theVariable = value * 3; // 1 to 100
  var distance = max - min;
  var position = min + (theVariable / 100) * distance;
  return position;
};

const isColor = col => {
  try {
    color(col)
      .lighten(0.9)
      .toString();
    return true;
  } catch (err) {
    return false;
  }
};

const colorStyles = [
  "color",
  "backgroundColor",
  "borderColor",
  "borderBottomColor",
  "borderTopColor"
];

const styles = {
  absolute: "position",
  fixed: "position",
  relative: "position",
  sticky: "position",
  color: "color",
  position: "position",
  w: "width",
  h: "height",
  br: "borderRadius",
  bw: "borderWidth",
  bc: "borderColor",
  of: "overflow",
  o: "opacity",
  t: "top",
  r: "right",
  b: "bottom",
  l: "left",
  p: "padding",
  px: "paddingHorizontal",
  py: "paddingVertical",
  pt: "paddingTop",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight",
  m: "margin",
  mx: "marginHorizontal",
  my: "marginVertical",
  mt: "marginTop",
  mb: "marginBottom",
  ml: "marginLeft",
  mr: "marginRight",
  width: "width",
  height: "height",
  maxWidth: "maxWidth",
  maxHeight: "maxHeight",
  flex: "flex",
  align: "alignItems",
  justify: "justifyContent",
  wrap: "flexWrap",
  direction: "flexDirection",
  content: "justifyContent",
  align: "alignItems",
  row: "flexDirection",
  zi: "zIndex",
  fz: "fontSize",
  fontSize: "fontSize",
  textAlign: "textAlign"
};

const getValueByBreak = (value, breakIndex = 0) => {
  if (value !== undefined && value !== null && typeof value === "object") {
    let index = value.length - 1 < breakIndex ? value.length - 1 : breakIndex;
    value = value[index || 0];
  }
  return value;
};

export const getStyle = ({
  theme,
  type,
  shadow,
  shadowColor,
  shadowCasting = "bottom",
  lighten,
  darken,
  alpha,
  bg,
  font,
  absoluteFill,
  ...rest
}) => {
  let style = {};

  Object.keys(rest).map(key => {
    let value = getValueByBreak(rest[key], theme.breakIndex);
    if (styles[key]) {
      if (typeof value === "boolean" && key === "row") {
        style[styles[key]] = value === true ? "row" : "column";
      } else {
        if (colorStyles.indexOf(key) > -1) {
          style[styles[key]] = theme.colors[value] || value;
        } else {
          style[styles[key]] = typeof value === "boolean" ? key : value;
        }
      }
    }
  });

  if (font && theme.fonts[font]) {
    style = { ...style, ...theme.fonts[font] };
  }

  if (absoluteFill) {
    style = {
      ...style,
      ...{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }
    };
  }

  if ((bg && isColor(bg) === true) || (bg && theme.colors[bg])) {
    let value = getValueByBreak(bg, theme.breakIndex);
    let col = theme.colors[value] || value;

    if (lighten) {
      col = color(col)
        .lighten(lighten)
        .toString();
    }

    if (darken) {
      col = color(col)
        .darken(darken)
        .toString();
    }

    if (alpha) {
      col = color(col)
        .alpha(alpha)
        .toString();
    }

    style["backgroundColor"] = col;
  }

  if (shadow) {
    const ssOffset =
      shadowCasting === "top"
        ? -Math.round(shadow / 5)
        : Math.round(shadow / 5);
    const sCololor = shadowColor || theme.colors.shadow;
    const sRadius = interpolate(1, 20, shadow);
    style["elevation"] = shadow;
    style["boxShadow"] = `0 ${ssOffset}px ${sRadius}px ${sCololor}`;
  }

  //console.log({ style });

  return style;
};
