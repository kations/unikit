import * as React from "react";
import * as PropTypes from "prop-types";
import color from "color";

import styled from "../styled";
import Hoverable from "../Hoverable";
import Ripple from "../Ripple";
import { isDark } from "../util";

const getBackground = ({ type, theme, isHovered, outlined, light }) => {
  console.log({ type });
  if (outlined) {
    return isHovered
      ? color(theme.colors[type] || type)
          .alpha(0.1)
          .toString()
      : "transparent";
  }
  if (light) {
    return isHovered
      ? color(theme.colors[type] || type)
          .alpha(0.15)
          .toString()
      : color(theme.colors[type] || type)
          .alpha(0.1)
          .toString();
  }
  return isHovered
    ? color(theme.colors[type] || type)
        .darken(0.1)
        .toString()
    : theme.colors[type] || type;
};

const Touchable = styled.TouchableOpacity(
  ({ theme, size, isHovered, outlined, rounded, light, type }) => ({
    width: "auto",
    height: size,
    paddingHorizontal: size / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: getBackground({
      type,
      theme,
      outlined,
      isHovered,
      light
    }),
    borderWidth: outlined ? 3 : 0,
    borderColor: theme.colors[type] || type,
    borderRadius: rounded ? size : 0,
    web: {
      cursor: "pointer"
    }
    // "769": {
    //   backgroundtype: 'blue',
    // },
  })
);

const Label = styled.Text(({ type, theme, color, outlined, light, size }) => ({
  fontSize: size / 3,
  color: color
    ? color
    : outlined || light
    ? theme.colors[type] || type
    : isDark(theme.colors[type] || type)
    ? "#FFF"
    : "#000"
}));

// const BoxTwo = styled.View`
//   width: 100px;
//   height: 10px;
//   background: red;
// `;

export default function Button({
  children,
  size = 44,
  type = "primary",
  activeOpacity = 0.9,
  outlined = false,
  rounded = false,
  light = false,
  color,
  labelProps = {},
  ripple = false,
  ...rest
}) {
  return (
    <Hoverable>
      {isHovered => (
        <Touchable
          as={ripple ? Ripple : undefined}
          isHovered={isHovered}
          activeOpacity={activeOpacity}
          size={size}
          outlined={outlined ? 1 : 0}
          rounded={rounded ? 1 : 0}
          light={light ? 1 : 0}
          type={type}
          rippleColor={ripple ? type : undefined}
          {...rest}
        >
          <Label
            color={color}
            outlined={outlined ? 1 : 0}
            light={light ? 1 : 0}
            size={size}
            type={type}
            {...labelProps}
          >
            {children}
          </Label>
        </Touchable>
      )}
    </Hoverable>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  size: PropTypes.number,
  type: PropTypes.string,
  color: PropTypes.string,
  labelStyle: PropTypes.object,
  labelProps: PropTypes.object,
  outlined: PropTypes.bool,
  rounded: PropTypes.bool,
  light: PropTypes.bool,
  ripple: PropTypes.bool
};
