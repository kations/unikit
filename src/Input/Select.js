import React, { useState } from "react";
import { Platform, Picker, TouchableOpacity } from "react-native";

import styled, { useTheme } from "../styled";

import Overlay from "../Overlay";
import Button from "../Button";
import Icon from "../Icon";
import TextInput from "./Text";

const Box = styled.View(({ theme }) => ({
  width: "100%",
  position: "relative",
}));

const Comp = (props) => {
  const {
    value,
    onChange,
    options = [],
    style,
    placeholder = "Please select...",
    doneText = "Done",
    overlayProps = {},
    inputProps = {},
    pickerProps = {},
    name,
    ...rest
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
        const option = options.find((e) => e.value === value);
        return option ? option.label : undefined;
      }
    }
    return value;
  };

  const renderPicker = () => {
    return (
      <Picker
        name={name}
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) =>
          onChange ? onChange(itemValue) : null
        }
        itemStyle={{ textAlign: "center", color: theme.colors.text }}
        {...pickerProps}
        style={[
          {
            width: "100%",
            paddingVertical: theme.globals.inputGap,
            paddingHorizontal: theme.globals.inputGap,
            margin: 0,
            borderRadius: 0,
            backgroundColor: "transparent",
            fontSize: theme.fonts.p.fontSize,
            color: theme.colors.text,
            ...Platform.select({
              web: {
                outlineWidth: 0,
                outlineColor: "unset",
                borderColor: "transparent",
                appearance: "none",
              },
            }),
          },
          pickerProps.style,
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
    <Box
      width="100%"
      br={theme.globals.roundness}
      relative
      style={style}
      {...rest}
    >
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
      <Box
        absolute
        t={0}
        r={theme.globals.inputGap}
        alignItems="center"
        justifyContent="center"
        h="100%"
        zIndex={10}
        w="auto"
        pointerEvents="none"
      >
        <Icon name="chevronDown" size={23} color="primary" />
      </Box>

      {Platform.OS === "ios" ? (
        <Overlay
          position="center"
          height="auto"
          visible={show}
          onClose={() => setShow(false)}
          contentProps={{ p: 20, maxWidth: 500, w: "90%", bg: "surface" }}
          {...overlayProps}
        >
          <Box width="100%">
            {renderPicker()}
            <Button m={0} onPress={() => setShow(false)}>
              {doneText}
            </Button>
          </Box>
        </Overlay>
      ) : null}
    </Box>
  );
};

export default Comp;
