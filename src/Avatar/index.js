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

const Label = styled(Text)(({ theme, type, textColor, size }) => ({
  color: textColor
    ? textColor
    : isDark(theme.colors[type] || type)
    ? "#FFF"
    : "#000",
  position: "relative",
  zIndex: 10,
  fontSize: size / 2.77,
  fontWeight: "bold"
}));

export function Avatar({
  bg = "primary",
  children,
  size = 44,
  char = "",
  textColor,
  onPress,
  source,
  ...rest
}) {
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
        <Label size={size} textColor={textColor}>
          {char}
        </Label>
      )}
    </Wrap>
  );
}

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

export default withThemeProps(Avatar, "Avatar");
