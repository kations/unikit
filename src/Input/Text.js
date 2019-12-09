import React from "react";
import color from "color";

import styled, { useTheme } from "../styled";

const TextInput = styled.TextInput(({ theme, textColor }) => ({
  fontSize: "p",
  backgroundColor: "transparent",
  width: "100%",
  paddingVertical: theme.globals.inputGap,
  paddingHorizontal: theme.globals.inputGap,
  borderRadius: 0,
  fontSize: 15,
  margin: 0,
  borderWidth: 0,
  color: textColor || "text",
  fontFamily: theme.globals.fontFamily,
  web: {
    outlineWidth: 0,
    outlineColor: "unset",
    borderColor: "transparent"
  }
}));

const getLinesByString = string => {
  let array = string.split(/\r*\n/);
  return array.length;
};

const Comp = props => {
  const {
    as,
    value,
    onChange,
    setFocus,
    onFocus,
    onBlur,
    placeholderColor,
    textColor,
    multiline,
    numberOfLines,
    ...rest
  } = props;
  const theme = useTheme();

  const placeholderTextColor =
    theme.colors[placeholderColor] ||
    placeholderColor ||
    theme.colors[textColor] ||
    textColor;

  const getLines = () => {
    const LinesByValue = getLinesByString(value || "");
    return numberOfLines >= LinesByValue ? numberOfLines : LinesByValue;
  };

  return (
    <TextInput
      value={value !== undefined && value !== null ? value.toString() : ""}
      as={as || undefined}
      onChangeText={text => (onChange ? onChange(text) : null)}
      placeholderTextColor={
        placeholderColor
          ? placeholderColor
          : color(placeholderTextColor).alpha(0.35)
      }
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
};

Comp.defaultProps = {
  placeholderColor: "text"
};

export default Comp;
