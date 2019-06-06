import React from "react";
import { TextInput, Platform } from "react-native";

import Box from "../primitives/Box";

const Comp = props => {
  const {
    as,
    onChange,
    style,
    multiline,
    setFocus,
    onFocus,
    onBlur,
    ...rest
  } = props;

  return (
    <Box
      as={as || TextInput}
      onChangeText={text => (onChange ? onChange(text) : null)}
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
      backgroundColor="transparent"
      width="100%"
      paddingVertical={10}
      borderRadius={0}
      fontSize={15}
      margin={0}
      style={[
        Platform.OS === "web"
          ? {
              border: "none",
              outline: "none",
              webkitAppearance: "none",
              mozAppearance: "none"
            }
          : {},
        style
      ]}
      multiline={multiline}
      {...rest}
    />
  );
};

export default Comp;
