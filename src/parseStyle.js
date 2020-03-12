import { Platform } from "react-native";
import tc from "tinycolor2";

import { styles } from "./styles";

//TODO
const getValueByBreak = (value, breakIndex = 0) => {
  let index = value.length - 1 < breakIndex ? value.length - 1 : breakIndex;
  value = value[index || 0];
  return value;
};

const isColor = col => {
  return tc(col).isValid();
};

function interpolateShadow(i, a, b, a2, b2) {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
}

export default function parseStyle({
  theme,
  font,
  shadow,
  shadowColor,
  overwriteStyles = true,
  ...rest
}) {
  let style = overwriteStyles === false ? rest : {};

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
            ...styl
          };
          delete style[key];
        }
        if (color) {
          value = theme.colors[value] || value;
          if (isColor(value)) {
            if (rest[`${key}Darken`] !== undefined) {
              value = tc(value)
                .darken(rest[`${key}Darken`])
                .toString();
            } else if (rest[`${key}Lighten`] !== undefined) {
              value = tc(value)
                .lighten(rest[`${key}Lighten`])
                .toString();
            } else if (rest[`${key}Alpha`] !== undefined) {
              value = tc(value)
                .setAlpha(rest[`${key}Alpha`])
                .toRgbString();
            }
          }
        }
        if (stylKey && rest[key] !== false) {
          style[stylKey] = value;
          delete style[key];
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
  delete style["flexCenter"];
  delete style["web"];
  delete style["native"];
  delete style["android"];
  delete style["ios"];
  delete style["font"];
  delete style["row"];

  return style;
}
