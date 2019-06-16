import React, { useState } from "react";
import { Platform, Picker, TouchableOpacity } from "react-native";

import styled from "../../style/styled";

const Headline = styled.Text({
  fontSize: "h3",
  color: "text"
});

import Box from "../primitives/Box";
import Icon from "../ui/Icon";
import Overlay from "../ui/Overlay";
import Button from "../ui/Button";

import TextInput from "./TextInput";
import Input from "./Input";

const Comp = props => {
  const {
    value,
    onChange,
    options,
    style,
    placeholder,
    overlayProps,
    inputProps
  } = props;

  const [show, setShow] = useState(false);

  const renderCheckbox = (option, index) => {
    const label = typeof option === "string" ? option : option.label;
    const optionValue = typeof option === "string" ? option : option.value;
    return (
      <Input
        key={`slect-${index}`}
        type="checkbox"
        value={optionValue === value}
        label={label}
        onChange={checked => {
          if (optionValue === value) {
            onChange(undefined);
          } else {
            onChange(optionValue);
          }
        }}
        style={{
          borderBottomWidth: index === options.length - 1 ? 0 : 1,
          borderBottomColor: "rgba(0,0,0,0.1)"
        }}
      />
    );
  };

  return (
    <Box width="100%" position="relative">
      <TouchableOpacity
        onPress={() => {
          setShow(true);
        }}
        style={{ width: "100%" }}
      >
        <TextInput
          type="text"
          editable={false}
          value={value}
          placeholder={placeholder}
          pointerEvents={Platform.OS === "web" ? "all" : "none"}
          {...inputProps}
        />
      </TouchableOpacity>
      <Icon type="arrowDown" position="absolute" top={10} right={0} size={23} />

      <Overlay
        position="bottom"
        height="auto"
        visible={show}
        onClose={() => setShow(false)}
        padding="20px"
        backdrop
        usePan={false}
        {...overlayProps}
      >
        <Box width="100%">
          {placeholder && <Headline>{placeholder}</Headline>}

          {options.map((option, index) => {
            return renderCheckbox(option, index);
          })}

          <Button onPress={() => setShow(false)}>Fertig</Button>
        </Box>
      </Overlay>
    </Box>
  );
};

Comp.defaultProps = {
  placeholder: "Please select...",
  overlayProps: {},
  inputProps: {}
};

export default Comp;
