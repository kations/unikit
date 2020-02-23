import Color from "color";
import { Platform } from "react-native";

import { styles } from "./styles";

//TODO
const getValueByBreak = (value, breakIndex = 0) => {
  let index = value.length - 1 < breakIndex ? value.length - 1 : breakIndex;
  value = value[index || 0];
  return value;
};

const isColor = col => {
  try {
    Color(col)
      .lighten(0.9)
      .toString();
    return true;
  } catch (err) {
    return false;
  }
};

function interpolateShadow(i, a, b, a2, b2) {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
}

export default function parseStyle({
  theme,
  font,
  shadow,
  shadowColor,
  ...rest
}) {
  let style = {};

  Object.keys(rest).map(key => {
    if (styles[key]) {
      const { stylKey, styl, color } = styles[key];
      let value = typeof rest[key] === "boolean" ? key : rest[key];
      if (
        value !== undefined &&
        value !== null &&
        typeof value === "object" &&
        value instanceof Array
      ) {
        value = getValueByBreak(value, theme.breakIndex);
      }
      if (stylKey || styl || color) {
        if (styl) {
          style = {
            ...style,
            ...{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }
          };
        }
        if (color) {
          value = theme.colors[value] || value;
          if (key === "bg" && rest.lighten && isColor(value) === true) {
            value = Color(value)
              .lighten(rest.lighten)
              .toString();
          }
          if (key === "bg" && rest.darken && isColor(value) === true) {
            value = Color(value)
              .darken(rest.darken)
              .toString();
          }
          if (key === "bg" && rest.alpha && isColor(value) === true) {
            value = Color(value)
              .alpha(rest.alpha)
              .toString();
          }
        }
        if (stylKey && rest[key] !== false) {
          style[stylKey] = value;
        } else {
          style[key] = value;
        }
      } else {
        style[key] = value;
      }
    }
  });
  if (font && theme.fonts[font]) {
    style = { ...style, ...theme.fonts[font] };
  }
  if (shadow) {
    let color = shadowColor || theme.colors.shadow;
    const b = Math.floor(shadow * 1.33);
    const h = shadow === 1 ? 1 : Math.floor(shadow * 0.5);
    const r = interpolateShadow(b, 1, 38, 1, 16).toFixed(2);
    const o = interpolateShadow(shadow, 1, 24, 0.2, 0.6).toFixed(2);
    style["elevation"] = shadow + 1;
    style["boxShadow"] = `0 ${h}px ${r}px ${color}`;
    if (Platform.OS === "android") style["shadowOpacity"] = o;
  }
  delete style["absoluteFill"];
  delete style["web"];
  delete style["native"];
  delete style["android"];
  delete style["ios"];
  delete style["font"];
  // console.log({ style });

  return style;
}
