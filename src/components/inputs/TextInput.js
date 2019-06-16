import React from "react";
import { Platform } from "react-native";

import styled from "../../style/styled";

const TextInput = styled.TextInput(() => ({
  fontSize: "p",
  backgroundColor: "transparent",
  width: "100%",
  paddingVertical: 10,
  borderRadius: 0,
  fontSize: 15,
  margin: 0,
  borderWidth: 0,
  ...Platform.select({
    web: {
      outlineWidth: 0,
      outlineColor: "unset",
      borderColor: "transparent",
      outline: "none",
      webkitAppearance: "none",
      mozAppearance: "none"
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
    ...rest
  } = props;

  return (
    <TextInput
      value={value || ""}
      as={as || undefined}
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
      style={style}
      {...rest}
    />
  );
};

export default Comp;
