import React from "react";
import PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";
import { isDark } from "../util";

import Button from "../Button";
import Text from "../Text";

const Wrap = styled.View(({ size }) => ({
  justifyContent: "center",
  alignItems: "center",
  height: size,
  width: size,
  borderRadius: size / 2,
  overflow: "hidden",
  web: {
    display: "inline-flex"
  }
}));

const BackgroundImage = styled.ImageBackground(({ size }) => ({
  position: "absolute",
  left: 0,
  top: 0,
  height: size,
  width: size,
  zIndex: 0,
  borderRadius: size / 2
}));

const Label = styled(Text)(({ size }) => ({
  position: "relative",
  zIndex: 10,
  fontSize: size / 2.77,
  fontWeight: "bold"
}));

const getShort = char => {
  let short = "";
  const split = char.split(" ");
  split.map((s, i) => {
    if (i < 2) {
      short = short + s.charAt(0).toUpperCase();
    }
  });
  return short;
};

const Avatar = withThemeProps(
  ({
    bg = "primary",
    children,
    size = 44,
    char = "",
    formatChar = false,
    textColor,
    onPress,
    source,
    ...rest
  }) => {
    return (
      <Wrap
        bg={bg}
        as={onPress ? Button : undefined}
        onPress={onPress || null}
        activeOpacity={onPress ? 0.8 : undefined}
        size={size}
        {...rest}
      >
        {source ? <BackgroundImage size={size} source={source} /> : null}
        {children ? (
          children
        ) : (
          <Label bgAware={bg} size={size} textColor={textColor}>
            {formatChar ? getShort(char) : char}
          </Label>
        )}
      </Wrap>
    );
  },
  "Avatar"
);

Avatar.propTypes = {
  type: PropTypes.string,
  char: PropTypes.string,
  size: PropTypes.number,
  source: PropTypes.object,
  onPress: PropTypes.func,
  textColor: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

Avatar.defaultPropTypes = {
  bg: "primary",
  size: 44,
  char: ""
};

export default Avatar;
