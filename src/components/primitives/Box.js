import React, { Component } from "react";
import { View } from "react-native";
import styled from "styled-components";
import { setLightness } from "polished";
import "parse-prop-types";
import PropTypes from "prop-types";
import { getProp, getColorSchema } from "../../helper";

// import styles from "./styles.css";
const BoolStyles = ["static", "absolute", "fixed", "relative", "sticky"];
const ColorStyles = ["color", "backgroundColor", "borderColor"];
const BasicStyles = [
  "width",
  "height",
  "maxWidth",
  "maxHeight",
  "minWidth",
  "minHeight",
  "fontSize",
  "borderWidth",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "flex",
  "flexWrap",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "opacity",
  "borderRadius",
  "top",
  "left",
  "right",
  "bottom",
  "zIndex",
  "fontSize",
  "lineHeight",
  "overflow",
  "borderWidth",
  "borderColor",
  "border"
];

const noPixel = ["opacity", "zIndex"];

const toString = (value, key) => {
  if (typeof value === "number") {
    var add = noPixel.indexOf(key) > -1 ? "" : "px";
    value = value.toString() + add;
  }
  return value;
};

const getBreak = (layout, breaks, value) => {
  var breaksArray = Object.values(breaks);
  var index = breaksArray.findIndex(item => item > layout.width);
  return value ? value[index] : undefined;
};

const mapProps = (props = {}) => {
  let styleString = "";
  let theme = props.theme.unikit;
  let compProps = theme[props.comp] || {};
  let breaks = props.theme.unikit.breaks || {
    mb: 0,
    tb: 768,
    dt: 1024
  };

  const p = Object.assign({}, compProps, props);

  Object.keys(p).map((key, index) => {
    if (BoolStyles.indexOf(key) > -1) {
      styleString += `position: ${key.replace(/([a-z])([A-Z])/g, "$1-$2")};`;
    } else if (BasicStyles.indexOf(key) > -1) {
      let value = getProp(p, key, p.comp);
      if (typeof value === "string" || typeof value === "number") {
        value = toString(value, key);
      } else {
        value = getBreak(theme.layout, breaks, value);
      }
      styleString += `${key.replace(/([a-z])([A-Z])/g, "$1-$2")}: ${value};`;
    } else if (ColorStyles.indexOf(key) > -1) {
      let color = getProp(p, key, p.comp);
      if (p[`${key}Lightness`]) {
        color = setLightness(p[`${key}Lightness`], color);
      }
      styleString += `${key.replace(/([a-z])([A-Z])/g, "$1-$2")}: ${color};`;
    }
  });
  return styleString;
};

const Box = styled(View)`
  margin: unset;
  padding: unset;
  border: unset;
  background: unset;
  font-size: 100%;
  box-sizing: border-box;
  ${p =>
    getProp(p, "shadow", p.comp || "box") &&
    `box-shadow: 0px 2px ${getProp(p, "shadow", p.comp || "box")}px ${getProp(
      p,
      "shadowColor",
      p.comp
    )};`}
  ${p => mapProps(p)}
`;

// font: unset;
// font-family: inherit;

const BasicPropTypes = {};
BasicStyles.reduce((obj, key) => {
  BasicPropTypes[key] = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]);
});

const ColorPropTypes = {};
ColorStyles.reduce((obj, key) => {
  BasicPropTypes[key] = PropTypes.string;
  BasicPropTypes[`${key}Lightness`] = PropTypes.number;
});

Box.propTypes = {
  static: PropTypes.bool,
  absolute: PropTypes.bool,
  fixed: PropTypes.bool,
  relative: PropTypes.bool,
  sticky: PropTypes.bool,
  shadow: PropTypes.number,
  shadowOpacity: PropTypes.number,
  shadowColor: PropTypes.string,
  ...BasicPropTypes,
  ...ColorPropTypes
};

console.log(Box.propTypes);

export default Box;
