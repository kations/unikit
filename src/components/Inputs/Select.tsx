import React, { useState } from "react";
import { Platform } from "react-native";
import { Picker as NativePicker } from "@react-native-picker/picker";

import { withThemeProps, Touchable } from "../../style";
import { isIOS } from "../../util";

import Tooltip from "../Tooltip";
import Icon from "../Icon";
import Flex from "../Flex";
import TextInput from "./Text";
import Text from "../Text";
import Switch from "./Switch";
import Checkbox from "./Checkbox";
import Button from "../Button";

const Select = ({
  size = 50,
  theme,
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
  multi = false,
  picker = "default",
  inline = false,
  row = false,
  responseType = "string",
  ...rest
}) => {
  if (multi && responseType === "string") responseType = "array";

  const onChangeValue = (v, option) => {
    if (multi === false && responseType === "string") {
      onChange(v === false ? undefined : option);
    } else if (responseType === "array") {
      let newV = value || [];
      if (v === true) {
        newV.push(option);
      } else {
        newV = newV.filter((o) => o !== option);
      }
      onChange(newV);
    } else if (responseType === "object") {
      let newV = value || {};
      if (v === true) {
        newV[option] = v;
      } else {
        delete newV[option];
      }
      onChange(newV);
    }
  };

  const renderCheckbox = (option, index) => {
    const label = typeof option === "string" ? option : option.label;
    const optionValue = typeof option === "string" ? option : option.value;
    if (picker === "switch" || picker === "checkbox") {
      const Comp = picker === "switch" ? Switch : Checkbox;
      const isActive = multi
        ? responseType === "object"
          ? value?.[optionValue] === true
          : (value || []).indexOf(optionValue) > -1
        : optionValue === value;
      return (
        <Touchable
          key={`pick-${index}`}
          alignItems="center"
          justifyContent="space-between"
          h={size}
          px={10}
          onPress={() => {
            onChangeValue(isActive ? false : true, optionValue);
          }}
          borderColor="text:setAlpha:0.05"
          borderBottomWidth={index === options.length - 1 ? 0 : 1}
          flexDirection={picker === "checkbox" ? "row-reverse" : "row"}
        >
          <Text>{label}</Text>
          <Comp
            size={size * (picker === "switch" ? 0.66 : 0.55)}
            value={isActive}
            mr={picker === "checkbox" ? 10 : 0}
            ml={picker === "switch" ? 10 : 0}
            onChange={(v) => onChangeValue(v, optionValue)}
          />
        </Touchable>
      );
    }
    return (
      <NativePicker.Item
        key={`pick-${index}`}
        label={label}
        value={optionValue}
      />
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
    if (picker === "switch" || picker === "checkbox") {
      return options.map((option, index) => {
        return renderCheckbox(option, index);
      });
    }
    return (
      <NativePicker
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
        <NativePicker.Item label={placeholder} value={null} />
        {options.map((option, index) => {
          return renderCheckbox(option, index);
        })}
      </NativePicker>
    );
  };

  const tooltipMode = isIOS || multi || picker !== "default";

  const Arrow = (
    <Flex
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
      <Icon name="chevron-down" size={23} color="primary" />
    </Flex>
  );

  if (!tooltipMode || inline) {
    return (
      <Flex width="100%" relative>
        <Flex
          width="100%"
          h={inline ? "auto" : size}
          overflow="hidden"
          bg="input"
          borderRadius={theme.globals.roundness}
          style={style}
          row={row}
          {...rest}
        >
          {renderPicker()}
        </Flex>
        {inline ? null : Arrow}
      </Flex>
    );
  }

  const mapArray =
    value && responseType === "object" ? Object.keys(value) : value || [];

  return (
    <Tooltip
      w="100%"
      color="input"
      position="center"
      popover={renderPicker()}
      wrapperProps={{
        w: 250,
        r: 0,
        t: 50,
      }}
      {...overlayProps}
    >
      <Flex width="100%" relative>
        {multi && mapArray?.length > 0 ? (
          <Flex
            minHeight={size}
            pl={size * 0.125}
            pt={size * 0.125}
            w="100%"
            bg="input"
            borderRadius={theme.globals.roundness}
            row
            wrap
            style={style}
            {...rest}
          >
            {mapArray.map((v) => {
              return (
                <Button
                  key={`select-value-${v}`}
                  size={size * 0.75}
                  onPress={() => {
                    onChangeValue(false, v);
                  }}
                  renderRight={
                    <Icon name="x" size={size * 0.33} color="#FFF" />
                  }
                  mr={size * 0.125}
                  mb={size * 0.125}
                  rounded
                >
                  {v}
                </Button>
              );
            })}
          </Flex>
        ) : (
          <TextInput
            type="text"
            editable={false}
            value={getValue()}
            placeholder={placeholder}
            pointerEvents={Platform.OS === "web" ? "all" : "none"}
            {...inputProps}
          />
        )}
        {Arrow}
      </Flex>
    </Tooltip>
  );
};

export default withThemeProps(Select, "Select");
