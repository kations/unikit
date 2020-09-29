import React from "react";

import styled, { useTheme, withThemeProps } from "../styled";
import { rem } from "../util";

const TextInput = styled.TextInput(({ theme, textColor }) => ({
  backgroundColor: "transparent",
  width: "100%",
  paddingHorizontal: theme.globals.inputGap,
  borderRadius: theme.globals.roundness,
  fontSize: rem(1),
  margin: 0,
  borderWidth: 0,
  color: textColor || "text",
  fontFamily: theme.globals.fontFamily,
  web: {
    outlineStyle: "none",
    borderColor: "transparent",
  },
}));

const getLinesByString = (string) => {
  let array = string.split(/\r*\n/);
  return array.length;
};

const Text = withThemeProps(
  ({
    as,
    value,
    onChange,
    setFocus,
    onFocus,
    onBlur,
    placeholderColor = "placeholder",
    textColor,
    multiline,
    numberOfLines,
    size = 50,
    ...rest
  }) => {
    const theme = useTheme();

    const placeholderTextColor =
      theme.colors[placeholderColor] || placeholderColor;

    const getLines = () => {
      const LinesByValue = getLinesByString(value || "");
      return numberOfLines >= LinesByValue ? numberOfLines : LinesByValue;
    };

    return (
      <TextInput
        h={multiline ? "auto" : size}
        minHeight={size}
        value={value !== undefined && value !== null ? value.toString() : ""}
        as={as || undefined}
        onChangeText={(text) => (onChange ? onChange(text) : null)}
        placeholderTextColor={placeholderTextColor}
        textColor={textColor}
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
        multiline={multiline}
        numberOfLines={multiline ? getLines() : undefined}
        {...rest}
      />
    );
  },
  "TextInput"
);

Text.defaultPropTypes = {
  placeholderColor: "placeholder",
};

export default Text;
