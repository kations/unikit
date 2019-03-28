import color from "color";

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

const ColorStyles = [
  "color",
  "backgroundColor",
  "borderColor",
  "bodyBackground",
  "headerBackground"
];

export const getProp = (props, theme, key, comp, subKey) => {
  const unikitTheme = theme;
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

  if (subKey && !value) {
    var subValue = getProp(props, theme, subKey, comp);
    value = color(subValue)
      .darken(0.2)
      .isDark()
      ? "#FFF"
      : "#000";
  }

  if (
    props[`${key}Lighten`] ||
    getObjValue(unikitTheme, `${comp}.${key}Lighten`)
  ) {
    var factor =
      props[`${key}Lighten`] ||
      getObjValue(unikitTheme, `${comp}.${key}Lighten`);
    value = color(value).lighten(factor);
  }
  return value;
};
