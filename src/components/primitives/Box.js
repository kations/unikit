import React, { Component } from "react";
import { View } from "react-native-web";
import { useTheme } from "../../style/Theme";
// import { setLightness } from "polished";
import "parse-prop-types";
import PropTypes from "prop-types";
import { getProp } from "../../helper";

// // import styles from "./styles.css";
const ColorStyles = ["color", "backgroundColor", "borderColor"];
const BasicStyles = [
  "position",
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

// console.log(Box.propTypes);

const mapProps = (props = {}, theme = {}) => {
  let styleObject = {};
  let compProps = theme[props.comp] || {};
  let breaks = theme.breaks || {
    mb: 0,
    tb: 768,
    dt: 1024
  };

  const p = Object.assign({}, compProps, props);

  Object.keys(p).map((key, index) => {
    if (BasicStyles.indexOf(key) > -1) {
      let value = getProp(p, theme, key, p.comp);
      if (typeof value === "string" || typeof value === "number") {
        value = toString(value, key);
      } else {
        value = getBreak(theme.layout, breaks, value);
      }

      styleObject[key] = value;
    } else if (ColorStyles.indexOf(key) > -1) {
      let color = getProp(p, theme, key, p.comp);
      if (p[`${key}Lightness`]) {
        color = setLightness(p[`${key}Lightness`], color);
      }
      styleObject[key] = color;
    }
  });
  return styleObject;
};

const Box = ({ children, style, as, ...rest }) => {
  const theme = useTheme();
  const propStyle = mapProps(rest, theme);
  var Comp = as || View;
  return (
    <Comp style={[style, propStyle]} {...rest}>
      {children}
    </Comp>
  );
};

Box.propTypes = {
  shadow: PropTypes.number,
  shadowOpacity: PropTypes.number,
  shadowColor: PropTypes.string,
  ...BasicPropTypes,
  ...ColorPropTypes
};

export default Box;
