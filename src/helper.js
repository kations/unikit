import React from "react";
import { Dimensions, Platform, StatusBar } from "react-native";
import PropTypes from "prop-types";
import color from "color";

import { withTheme } from "./style/Theme";

export const isIphoneX = () => {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      (dimen.height === 896 || dimen.width === 896))
  );
};

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

export const getColorMode = colorString => {
  const { r, g, b } = color(colorString)
    .rgb()
    .object();
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 180 ? "dark" : "light";
};

export const getProp = (props, theme, key, comp, subKey, forceSubKey) => {
  const unikitTheme = theme;
  let value = undefined;
  if (props[key] !== undefined) {
    value = props[key];
  } else if (
    props.mode &&
    getObjValue(unikitTheme, `${comp}.mode.${props.mode}.${key}`) !== undefined
  ) {
    value = getObjValue(unikitTheme, `${comp}.mode.${props.mode}.${key}`);
  } else if (getObjValue(unikitTheme, `${comp}.${key}`) !== undefined) {
    value = getObjValue(unikitTheme, `${comp}.${key}`);
  } else if (getObjValue(unikitTheme, `globals.${key}`) !== undefined) {
    value = getObjValue(unikitTheme, `globals.${key}`);
  } else if (getObjValue(unikitTheme, `colors.${key}`) !== undefined) {
    value = getObjValue(unikitTheme, `colors.${key}`);
  }

  if (getObjValue(unikitTheme, `colors.${value}`)) {
    value = getObjValue(unikitTheme, `colors.${value}`);
  }

  if ((subKey && !value) || (subKey && forceSubKey)) {
    var subValue = getProp(props, theme, subKey, comp);
    value = color(subValue)
      .darken(0.2)
      .isDark()
      ? "#FFF"
      : "#000";
  }

  var lightenFactor = undefined;
  if (props[`${key}Lighten`]) {
    lightenFactor = props[`${key}Lighten`];
  } else if (
    props.mode &&
    getObjValue(unikitTheme, `${comp}.mode.${props.mode}.${key}Lighten`)
  ) {
    lightenFactor = getObjValue(
      unikitTheme,
      `${comp}.mode.${props.mode}.${key}Lighten`
    );
  } else if (getObjValue(unikitTheme, `${comp}.${key}Lighten`)) {
    lightenFactor = getObjValue(unikitTheme, `${comp}.${key}Lighten`);
  }

  if (lightenFactor) {
    value = color(value).lighten(lightenFactor);
  }

  return value;
};
