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

export const defaultTheme = {
  unikit: {
    avatar: {
      mode: "primary",
      size: 60
    },
    button: {
      mode: "primary"
    },
    switch: {
      circleSize: 25
    }
  }
};

export const getProp = (props, key, comp) => {
  const unikitTheme = Object.assign(
    {},
    defaultTheme.unikit,
    props.theme.unikit
  );
  if (props[key] !== undefined) {
    return props[key];
  } else if (getObjValue(unikitTheme, `${comp}.${key}`) !== undefined) {
    return getObjValue(unikitTheme, `${comp}.${key}`);
  } else if (getObjValue(unikitTheme, `globals.${key}`) !== undefined) {
    return getObjValue(unikitTheme, `globals.${key}`);
  } else if (getObjValue(unikitTheme, `colors.${key}`) !== undefined) {
    return getObjValue(unikitTheme, `colors.${key}`);
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
