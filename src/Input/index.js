import React, { useState } from "react";
import color from "color";
import { Dimensions, TouchableOpacity } from "react-native";
import { useTransition, animated } from "react-spring/native";
import PropTypes from "prop-types";

import styled, { useTheme, useThemeProps, withThemeProps } from "../styled";
import Box from "../Box";
import Flex from "../Flex";
// import Switch from "./Switch";
import Text from "./Text";
// import DatePicker from "./DatePicker";
import Slider from "./Slider";
// import Color from "./Color";
// import Select from "./Select";
// import Number from "./Number";
// import Checkbox from "./Checkbox";
// import MultiSelect from "./MultiSelect";
// import Tags from "./Tags";

const types = {
  text: Text,
  // select: Select,
  // switch: Switch,
  // date: DatePicker,
  // datetime: DatePicker,
  // time: DatePicker,
  range: Slider
  // color: Color,
  // number: Number,
  // checkbox: Checkbox,
  // multiselect: MultiSelect,
  // tags: Tags
};

const Label = styled.Text(({ color }) => ({
  color: color,
  fontSize: "label"
}));

const Desc = styled.Text({});

const InputWrapper = styled(Box)(({ theme }) => ({
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  backgroundColor: "surface",
  width: "100%",
  height: "auto",
  minHeight: 55,
  padding: 15,
  borderRadius: theme.globals.roundness,
  paddingBottom: 4
}));

const BorderWrap = styled.View(({ size, borderBlurColor }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  height: 2,
  width: size,
  backgroundColor: borderBlurColor,
  zIndex: 100,
  overflow: "hidden"
}));

const Border = animated(
  styled.View(({ borderFocusColor }) => ({
    height: "100%",
    width: "100%",
    backgroundColor: borderFocusColor
  }))
);

const typesProps = {
  switch: {
    wrapperProps: {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 15
      }
    },
    labelProps: {
      style: {
        fontSize: "p"
      }
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
      style: {
        fontSize: "p",
        marginLeft: 10
      }
    }
  },
  date: {
    wrapperProps: {
      readOnly: true
    }
  }
};

const Comp = ({
  children,
  label,
  desc,
  error,
  style,
  direction,
  type = "text",
  onChange,
  value,
  labelColor = "text",
  borderProps = {},
  borderBlurColor = "transparent",
  borderFocusColor = "primary",
  theme,
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
      onPress={() => {
        if (onChange) {
          onChange(!value);
        }
      }}
      onLayout={event => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
      activeOpacity={0.8}
      style={{
        ...style,
        ...(TypeProps.wrapperProps ? TypeProps.wrapperProps.style : {})
      }}
      {...rest}
    >
      <Flex>
        {label ? (
          <Label
            color={error ? "error" : focused ? "primary" : labelColor}
            {...TypeProps.labelProps}
          >
            {label}
          </Label>
        ) : null}
        {desc ? (
          <Desc
            style={{ color: color(theme.colors.text).alpha(0.5), fontSize: 10 }}
          >
            {desc}
          </Desc>
        ) : null}
      </Flex>
      {InputComp ? (
        <InputComp
          onChange={onChange}
          value={value}
          setFocus={setFocus}
          type={type}
          label={label}
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
              ...children.props,
              ...rest
            })
          )
        : null}
      <BorderWrap size={width} borderBlurColor={borderBlurColor}>
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
  type: PropTypes.oneOf(["text", "range"])
};

ThemeComp["Slider"] = Slider;
export default ThemeComp;
