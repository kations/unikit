import React from "react";
import { Platform } from "react-native";
import color from "color";

import styled, { useTheme } from "../styled";
import Box from "../Box";

const TextInput = styled.TextInput(({ theme, textColor }) => ({
  fontSize: "p",
  backgroundColor: "transparent",
  width: "100%",
  paddingVertical: 10,
  borderRadius: 0,
  fontSize: 15,
  margin: 0,
  borderWidth: 0,
  color: textColor,
  fontFamily: theme.globals.fontFamily,
  ...Platform.select({
    web: {
      outlineWidth: 0,
      outlineColor: "unset",
      borderColor: "transparent"
    }
  })
}));

const Comp = props => {
  const {
    as,
    value,
    onChange,
    style,
    setFocus,
    onFocus,
    onBlur,
    placeholderColor,
    ...rest
  } = props;

  const theme = useTheme();

  const placeholderTextColor =
    theme.colors[placeholderColor] || placeholderColor;

  return (
    <TextInput
      value={value !== undefined && value !== null ? value.toString() : ""}
      as={as || undefined}
      onChangeText={text => (onChange ? onChange(text) : null)}
      placeholderTextColor={color(placeholderTextColor).alpha(0.35)}
      underlineColorAndroid="transparent"
      onFocus={() => {
        if (setFocus) {
          setFocus(true);
        }
        if (onFocus) {
          onFocus();
        }
      }}
      onBlur={() => {
        if (setFocus) {
          setFocus(false);
        }
        if (onBlur) {
          onBlur();
        }
      }}
      style={style}
      {...rest}
    />
  );
};

Comp.defaultProps = {
  placeholderColor: "text"
};

export default Comp;
