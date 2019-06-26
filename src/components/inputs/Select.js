import React, { useState } from "react";
import { Platform, Picker, TouchableOpacity } from "react-native";

import styled from "../../style/styled";

const Headline = styled.Text({
  fontSize: "h3",
  color: "text"
});

import Box from "../primitives/Box";
import Overlay from "../ui/Overlay";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import TextInput from "./TextInput";

const SelectIcon = styled(Icon)({
  position: "absolute",
  top: 10,
  right: 0
});

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
      <Picker.Item key={`pick-${index}`} label={label} value={optionValue} />
    );
  };

  const getValue = () => {
    if (value && options) {
      if (typeof options[0] === "string") {
        return value;
      } else {
        return options.find(e => e.value === value).label;
      }
    }
    return value;
  };

  const renderPicker = () => {
    return (
      <Picker
        selectedValue={getValue()}
        onValueChange={(itemValue, itemIndex) =>
          onChange ? onChange(itemValue) : null
        }
        itemStyle={{ textAlign: "center" }}
        style={[
          {
            width: "100%",
            paddingVertical: 10,
            margin: 0,
            borderRadius: 0,
            backgroundColor: "transparent",
            ...Platform.select({
              web: {
                outlineWidth: 0,
                outlineColor: "unset",
                borderColor: "transparent",
                appearance: "none"
              }
            })
          },
          style
        ]}
      >
        <Picker.Item label={placeholder} value={null} />
        {options.map((option, index) => {
          return renderCheckbox(option, index);
        })}
      </Picker>
    );
  };

  return (
    <Box width="100%" position="relative">
      {Platform.OS !== "ios" ? renderPicker() : null}
      {Platform.OS === "ios" ? (
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
      ) : null}
      <SelectIcon type="arrowDown" size={23} color="primary" />

      {Platform.OS === "ios" ? (
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

            {renderPicker()}

            <Button onPress={() => setShow(false)}>Fertig</Button>
          </Box>
        </Overlay>
      ) : null}
    </Box>
  );
};

Comp.defaultProps = {
  placeholder: "Please select...",
  overlayProps: {},
  inputProps: {}
};

export default Comp;
