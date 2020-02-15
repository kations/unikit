import React, { useState } from "react";
import { Dimensions, TouchableOpacity, Platform } from "react-native";
import { useTransition, animated } from "react-spring/native";
import PropTypes from "prop-types";

import styled, { withThemeProps, useTheme } from "../styled";
import Flex from "../Flex";
import Switch from "./Switch";
import Text from "./Text";
import DatePicker from "./DatePicker";
import Slider from "./Slider";
import Color from "./Color";
import Select from "./Select";
import Number from "./Number";
import Checkbox from "./Checkbox";
import MultiSelect from "./MultiSelect";
import Tags from "./Tags";

const Label = styled.Text(({ color, size }) => ({
  color: color,
  font: "label"
}));

const InputWrapper = styled.View(({ theme }) => ({
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  height: "auto",
  borderRadius: theme.globals.roundness
}));

const BorderWrap = styled.View(({ theme, size }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "100%",
  width: size,
  zIndex: 100,
  overflow: "hidden",
  borderRadius: theme.globals.roundness,
  justifyContent: "flex-end"
}));

const BorderBlur = styled.View(({ borderBlurColor }) => ({
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "100%",
  height: 2,
  width: "100%",
  backgroundColor: borderBlurColor
}));

const Border = animated(
  styled.View(({ borderFocusColor }) => ({
    height: 2,
    width: "100%",
    backgroundColor: borderFocusColor
  }))
);

const SwitchInput = ({ label, bg, shadow, clean, labelColor, ...rest }) => {
  const theme = useTheme();
  return (
    <Flex
      p={theme.globals.inputGap * 0.5}
      pl={theme.globals.inputGap}
      mt={clean ? theme.globals.inputGap : 0}
      br={theme.globals.roundness}
      row
      w="100%"
      content="space-between"
      align="center"
      bg={bg}
      shadow={shadow}
    >
      <Label font="p" color={labelColor}>
        {label}
      </Label>
      <Switch size={35} {...rest} />
    </Flex>
  );
};

const types = {
  text: Text,
  textarea: Text,
  select: Select,
  switch: SwitchInput,
  date: DatePicker,
  datetime: DatePicker,
  time: DatePicker,
  range: Slider,
  color: Color,
  number: Number,
  checkbox: Checkbox,
  multiselect: MultiSelect,
  tags: Tags
};

const typesProps = {
  switch: {
    wrapperProps: {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }
    },
    labelProps: {
      size: "p"
    }
  },
  checkbox: {
    wrapperProps: {
      style: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 15
      }
    },
    labelProps: {
      size: "p",
      style: {
        marginLeft: 10
      }
    }
  },
  date: {
    wrapperProps: {
      readOnly: true
    }
  },
  textarea: {
    numberOfLines: 3,
    multiline: true
  }
};

const Comp = ({
  children,
  label,
  indentLabel = false,
  error,
  style,
  direction,
  type,
  onChange,
  value,
  labelColor = "text",
  borderProps = {},
  wrapperProps = {},
  placeholder,
  borderBlurColor = "transparent",
  borderFocusColor = "primary",
  required = false,
  clean = false,
  floating = false,
  options,
  theme,
  shadow,
  ...rest
}) => {
  const [focused, setFocus] = useState(false);
  const [width, setWidth] = useState(Dimensions.get("window").width);

  const InputComp = types[type] || undefined;

  const TypeProps = typesProps[type] || {};

  const transitions = useTransition(focused, null, {
    from: { left: -width },
    enter: { left: 0 },
    leave: { left: width }
  });

  return (
    <InputWrapper
      as={
        ["switch", "checkbox"].indexOf(type) > -1 ? TouchableOpacity : undefined
      }
      bg={clean ? "transparent" : "surface"}
      onPress={() => {
        if (onChange) {
          onChange(!value);
        }
      }}
      bg={clean ? "transparent" : "surface"}
      onLayout={event => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
      activeOpacity={0.8}
      shadow={clean ? undefined : shadow}
      style={{
        ...style,
        ...(TypeProps.wrapperProps ? TypeProps.wrapperProps.style : {})
      }}
      {...wrapperProps}
    >
      {label ? (
        <Flex>
          {label && ["switch"].indexOf(type) === -1 ? (
            <Label
              accessibilityRole={Platform.OS === "web" ? "label" : "text"}
              color={error ? "error" : focused ? "primary" : labelColor}
              mb={clean ? 5 : 0}
              ml={clean && indentLabel !== true ? 0 : theme.globals.inputGap}
              mt={theme.globals.inputGap}
              {...TypeProps.labelProps}
            >
              {label}
              {required ? "*" : null}
            </Label>
          ) : null}
        </Flex>
      ) : null}
      {InputComp ? (
        <InputComp
          bg={clean ? "surface" : "transparent"}
          onChange={onChange}
          value={value}
          setFocus={setFocus}
          type={type}
          label={label}
          required={required}
          options={options}
          placeholder={placeholder}
          shadow={clean ? shadow : undefined}
          labelColor={error ? "error" : focused ? "primary" : labelColor}
          clean={clean}
          {...TypeProps}
          {...rest}
        />
      ) : null}
      {children
        ? React.Children.only(
            React.cloneElement(children, {
              setFocus,
              onChange,
              value,
              type,
              label,
              required,
              clean,
              labelColor: error ? "error" : focused ? "primary" : labelColor,
              ...children.props,
              ...rest
            })
          )
        : null}
      <BorderWrap size={width} pointerEvents="none">
        <BorderBlur borderBlurColor={borderBlurColor} />
        {transitions.map(({ item, key, props }) =>
          item ? (
            <Border
              key={key}
              borderFocusColor={borderFocusColor}
              {...borderProps}
              style={{
                transform: [{ translateX: props.left }],
                ...borderProps.style
              }}
            />
          ) : null
        )}
      </BorderWrap>
    </InputWrapper>
  );
};

const ThemeComp = withThemeProps(Comp, "Input");

ThemeComp.propTypes = {
  type: PropTypes.oneOf([
    "text",
    "textarea",
    "range",
    "date",
    "time",
    "datetime",
    "checkbox",
    "number",
    "select",
    "multiselect",
    "switch",
    "tags"
  ])
};

ThemeComp["Text"] = Text;
ThemeComp["Slider"] = Slider;
ThemeComp["Tags"] = Tags;
ThemeComp["Switch"] = Switch;
ThemeComp["Select"] = Select;
ThemeComp["Number"] = Number;
ThemeComp["Checkbox"] = Checkbox;
ThemeComp["DatePicker"] = DatePicker;
ThemeComp["Color"] = Color;
ThemeComp["MultiSelect"] = MultiSelect;

export default ThemeComp;
