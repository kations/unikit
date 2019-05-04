import React, { Component } from "react";
import { View, StyleSheet } from "react-native-web";
import { useTheme, withTheme } from "../../style/Theme";
// import { setLightness } from "polished";
import "parse-prop-types";
import PropTypes from "prop-types";
import { getProp } from "../../helper";

// // import styles from "./styles.css";
const ColorStyles = ["color", "backgroundColor", "borderColor", "shadowColor"];
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
  "border",
  "shadowRadius",
  "shadowOffset",
  "shadowOpacity"
];

const noPixel = ["opacity", "zIndex", "shadowOpacity"];

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

const interpolate = (min, max, value) => {
  var theVariable = value * 3; // 1 to 100
  var distance = max - min;
  var position = min + (theVariable / 100) * distance;
  return position;
};

// console.log(Box.propTypes);

const mapProps = (props = {}, theme = {}) => {
  let styleObject = {};
  let comp = props.comp || "globals";
  let globalProps = theme["globals"] || {};
  let compProps = theme[comp] || {};
  let breaks = theme.breaks || {
    mb: 0,
    tb: 768,
    dt: 1024
  };

  if (comp !== "globals") {
    var p = Object.assign({}, globalProps, compProps, props);
  } else {
    var p = Object.assign({}, compProps, props);
  }

  if (props.mode && theme[comp].mode[props.mode]) {
    p = Object.assign({}, p, theme[comp].mode[props.mode]);
  }

  Object.keys(p).map((key, index) => {
    if (BasicStyles.indexOf(key) > -1) {
      let value = getProp(p, theme, key, p.comp);
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "object"
      ) {
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

  //if (comp === "globals") console.log({ styleObject });

  if (p.shadow) {
    styleObject = Object.assign({}, styleObject, {
      shadowColor: styleObject.shadowColor || "#000",
      shadowOffset: {
        width: 0,
        height: Math.round(p.shadow / 2)
      },
      shadowOpacity:
        styleObject.shadowOpacity || interpolate(0.1, 0.5, p.shadow),
      shadowRadius: styleObject.shadowRadius || interpolate(1, 25, p.shadow),
      elevation: p.shadow
    });
  } else {
    styleObject = Object.assign({}, styleObject, {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0
    });
  }

  return styleObject;
};

// const Box = ({ children, style, as, ...rest }) => {
//   const theme = useTheme();
//   const propStyle = mapProps(rest, theme);
//   var Comp = as || View;
//   // return (
//   //   <Comp {...rest} style={StyleSheet.flatten([propStyle, style])}>
//   //     {children}
//   //   </Comp>
//   // );
//   return React.createElement(Comp, {
//     style: StyleSheet.flatten([propStyle, style]),
//     children: children,
//     ...rest
//   });
// };

class Box extends React.PureComponent {
  render() {
    const { children, style, theme, as, ...rest } = this.props;
    const propStyle = mapProps(rest, theme);
    var Comp = as || View;
    // return (
    //   <Comp {...rest} style={StyleSheet.flatten([propStyle, style])}>
    //     {children}
    //   </Comp>
    // );
    return React.createElement(Comp, {
      style: StyleSheet.flatten([propStyle, style]),
      children: children,
      ...rest
    });
  }
}

Box.propTypes = {
  ...BasicPropTypes,
  ...ColorPropTypes
};

export default withTheme(Box);
