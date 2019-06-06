import React from "react";
import { Platform, Picker } from "react-native";

import Box from "../primitives/Box";
import Icon from "../ui/Icon";

import TextInput from "./TextInput";

const Comp = props => {
  const { value, onChange, options, style, placeholder, ...rest } = props;

  console.log({ value });

  return (
    <Box width="100%" position="relative">
      <Icon type="arrowDown" position="absolute" top={10} right={0} size={23} />
      <Picker
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) =>
          onChange ? onChange(itemValue) : null
        }
        itemStyle={{ textAlign: "right" }}
        style={[
          {
            width: "100%",
            paddingVertical: 10,
            margin: 0,
            borderRadius: 0,
            textAlign: "right",
            outline: "none",
            fontSize: 15,
            backgroundColor: "transparent"
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
        {...rest}
      >
        <Picker.Item label={placeholder} value={null} />
        {options &&
          options.map((option, index) => {
            if (typeof option === "string") {
              return (
                <Picker.Item
                  key={`pick-${index}`}
                  label={option}
                  value={option}
                />
              );
            } else {
              return (
                <Picker.Item
                  key={`pick-${index}`}
                  label={option.label}
                  value={option.value}
                />
              );
            }
          })}
      </Picker>
    </Box>
  );
};

Comp.defaultProps = {
  placeholder: "Please select..."
};

export default Comp;
