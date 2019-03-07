import { parseToRgb, setLightness } from "polished";

export const getObjValue = (o, s) => {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

export const lightOrDark = color => {
  if (!color) return false;
  const { red, green, blue } = parseToRgb(color);
  if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
    return true;
  } else {
    return false;
  }
};

const ColorStyles = [
  "color",
  "backgroundColor",
  "borderColor",
  "bodyBackground",
  "headerBackground"
];

export const getProp = (props, key, comp) => {
  const unikitTheme = props.theme ? props.theme.unikit : {};
  let value = undefined;
  if (props[key] !== undefined) {
    value = props[key];
  } else if (getObjValue(unikitTheme, `${comp}.${key}`) !== undefined) {
    value = getObjValue(unikitTheme, `${comp}.${key}`);
  } else if (getObjValue(unikitTheme, `box.${key}`) !== undefined) {
    value = getObjValue(unikitTheme, `box.${key}`);
  } else if (getObjValue(unikitTheme, `colors.${key}`) !== undefined) {
    value = getObjValue(unikitTheme, `colors.${key}`);
  }

  if (getObjValue(unikitTheme, `colors.${value}`)) {
    value = getObjValue(unikitTheme, `colors.${value}`);
  }

  if (
    props[`${key}Lightness`] ||
    getObjValue(unikitTheme, `${comp}.${key}Lightness`)
  ) {
    value = setLightness(
      props[`${key}Lightness`] ||
        getObjValue(unikitTheme, `${comp}.${key}Lightness`),
      value
    );
  }
  return value;
};

export const getColorSchema = (props, color, type) => {
  var newColor = color;
  if (!newColor) return {};
  var lightness = getProp(props, "lightness", "global") || 0.94;
  if (type === "light") {
    newColor = setLightness(lightness, newColor);
  }
  const dark = lightOrDark(newColor);
  return {
    background: newColor,
    text: dark ? color : "#FFF"
  };
};
