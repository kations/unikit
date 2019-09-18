import React from "react";
import PropTypes from "prop-types";

import styled, { useTheme } from "../styled";
import { isDark } from "../util";

import Box from "../Box";
import Button from "../Button";

const Wrap = styled(Box)(({ size }) => ({
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

const Label = styled.Text(({ theme, type, textColor, size }) => ({
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

export default function Avatar(props) {
  const {
    type = "primary",
    children,
    size = 44,
    char = "",
    textColor,
    onPress,
    source,
    ...rest
  } = props;
  const theme = useTheme();
  return (
    <Wrap
      type={type}
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
