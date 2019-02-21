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
  const { red, green, blue } = parseToRgb(color);
  if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
    return true;
  } else {
    return false;
  }
};

export const getProp = (props, key, comp) => {
  if (getObjValue(props.theme.unikit, `${comp}.${key}`) !== undefined) {
    return getObjValue(props.theme.unikit, `${comp}.${key}`);
  } else if (getObjValue(props.theme.unikit, `globals.${key}`) !== undefined) {
    return getObjValue(props.theme.unikit, `globals.${key}`);
  } else if (getObjValue(props.theme.unikit, `colors.${key}`) !== undefined) {
    return getObjValue(props.theme.unikit, `colors.${key}`);
  } else {
    return undefined;
  }
};

export const getColorSchema = (props, color, type) => {
  var newColor = color;
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
