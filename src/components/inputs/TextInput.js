import React from "react";
import { TextInput, Platform } from "react-native-web";

import Box from "../primitives/Box";

const Comp = props => {
  const { as, onChange, style, multiline, ...rest } = props;

  return (
    <Box
      as={as || TextInput}
      onChangeText={text => (onChange ? onChange(text) : null)}
      style={[
        {
          height: multiline ? "auto" : 54,
          flex: 1,
          padding: 0,
          paddingVertical: multiline ? 10 : 0,
          margin: 0,
          borderRadius: 0,
          textAlign: "right",
          outline: "none",
          fontSize: 15
        },
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
