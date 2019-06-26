import React from "react";
import PropTypes from "prop-types";
import color from "color";

import { withTheme } from "./style/Theme";

const createComponentFunc = config => {
  const {
    name,
    style,
    omitProps = [],
    propTypes = {},
    render = ({ Comp, ...props }) => <Comp {...props} />,
    defaultComponent = "div",
    system = fullSystem,
    applySystem = system => props => ({
      "&&": system.props(props)
    }),
    InnerComponent: InnerComponentFromConfig,
    theme
  } = config();

  const InnerComponent =
    InnerComponentFromConfig ||
    function Component({ as, forwardedRef, ...props }) {
      const Comp = as || defaultComponent;

      const renderProps = {
        ref: forwardedRef,
        Comp,
        ...props
      };

      return render(renderProps);
    };

  InnerComponent.displayName = `uni-${name}`;

  function forwardRef(props, ref) {
    return <InnerComponent {...props} forwardedRef={ref} />;
  }
  forwardRef.displayName = InnerComponent.displayName;

  const RefComponent = React.forwardRef(forwardRef);
  RefComponent.displayName = InnerComponent.displayName;

  RefComponent.propTypes = {
    theme: PropTypes.object
  };

  const defaultProps = theme[name];

  RefComponent.defaultProps = {
    ...defaultProps
  };

  return RefComponent;
};

export const createComponent = withTheme(createComponentFunc);

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

export const getColorMode = colorString => {
  if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorString)) {
    return color(colorString).isDark() ? "dark" : "light";
  }
  return "light";
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
