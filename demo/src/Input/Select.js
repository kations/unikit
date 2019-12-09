import React, { useState } from "react";
import { Platform, Picker, TouchableOpacity } from "react-native";

import styled, { useTheme } from "../styled";

import Overlay from "../Overlay";
import Button from "../Button";
import Icon from "../Icon";
import TextInput from "./Text";

const Box = styled.View({
  width: "100%",
  position: "relative"
});

const Headline = styled.Text({
  fontSize: "h3",
  color: "text"
});

// const SelectIcon = styled(Icon)({
//   position: "absolute",
//   top: 10,
//   right: 5
// });

const Comp = props => {
  const {
    value,
    onChange,
    options,
    style,
    placeholder = "Please select...",
    overlayProps = {},
    inputProps = {},
    pickerProps = {}
  } = props;
  const theme = useTheme();
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
        const option = options.find(e => e.value === value);
        return option ? option.label : undefined;
      }
    }
    return value;
  };

  const renderPicker = () => {
    return (
      <Picker
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) =>
          onChange ? onChange(itemValue) : null
        }
        itemStyle={{ textAlign: "center", color: theme.colors.text }}
        {...pickerProps}
        style={[
          {
            width: "100%",
            paddingVertical: 10,
            margin: 0,
            borderRadius: 0,
            backgroundColor: "transparent",
            fontSize: theme.fontSize.p,
            ...Platform.select({
              web: {
                outlineWidth: 0,
                outlineColor: "unset",
                borderColor: "transparent",
                appearance: "none"
              }
            })
          },
          pickerProps.style
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
    <Box width="100%" position="relative" style={style}>
      {Platform.OS !== "ios" ? renderPicker() : null}
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          onPress={() => {
            setShow(!show);
          }}
          style={{ width: "100%" }}
        >
          <TextInput
            type="text"
            editable={false}
            value={getValue()}
            placeholder={placeholder}
            pointerEvents={Platform.OS === "web" ? "all" : "none"}
            {...inputProps}
          />
        </TouchableOpacity>
      ) : null}
      <Icon
        name="arrowDown"
        size={23}
        color="primary"
        style={{
          position: "absolute",
          top: 10,
          right: 5
        }}
      />

      {Platform.OS === "ios" ? (
        <Overlay
          position="center"
          height="auto"
          visible={show}
          onClose={() => setShow(false)}
          p={20}
          style={{ maxWidth: 500, width: "90%" }}
          {...overlayProps}
        >
          <Box width="100%">
            {placeholder && <Headline>{placeholder}</Headline>}
            <Headline>{value}</Headline>

            {renderPicker()}

            <Button m={0} onPress={() => setShow(false)}>
              Fertig
            </Button>
          </Box>
        </Overlay>
      ) : null}
    </Box>
  );
};

export default Comp;
