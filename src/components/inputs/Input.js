import React, { useState } from "react";
import color from "color";
import { View, Dimensions, TouchableOpacity, Text } from "react-native";
import { useTransition, animated } from "react-spring/native";

import { useTheme } from "../../style/Theme";
import styled from "../../style/styled";

const Label = styled.Text(({ color }) => ({
  color: color,
  fontSize: "label"
}));

const InputWrapper = styled.View({
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  backgroundColor: "surface",
  height: "auto",
  minHeight: 55,
  padding: 15,
  overflow: "hidden",
  borderRadius: 3,
  paddingBottom: 4
});

import Flex from "../primitives/Flex";

import Switch from "./Switch";
import TextInput from "./TextInput";
import DatePicker from "./DatePicker";
import Slider from "./Slider";
import Color from "./Color";
import Select from "./Select";
import Number from "./Number";
import Checkbox from "./Checkbox";

const types = {
  text: TextInput,
  select: Select,
  switch: Switch,
  date: DatePicker,
  datetime: DatePicker,
  time: DatePicker,
  range: Slider,
  color: Color,
  number: Number,
  checkbox: Checkbox
};

const typesProps = {
  switch: {
    wrapperProps: {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
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

const Border = animated(Flex);

const Comp = props => {
  const {
    children,
    label,
    desc,
    error,
    style,
    direction,
    type,
    onChange,
    value,
    ...rest
  } = props;

  const [focused, setFocus] = useState(false);
  const [width, setWidth] = useState(Dimensions.get("window").width);

  const theme = useTheme();

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
      style={[
        style,
        TypeProps.wrapperProps ? TypeProps.wrapperProps.style : {}
      ]}
      {...rest}
    >
      <Flex>
        {label ? (
          <Label
            color={error ? "error" : focused ? "primary" : "text"}
            {...TypeProps.labelProps}
          >
            {label}
          </Label>
        ) : null}
        {desc ? (
          <Text
            style={{ color: color(theme.colors.text).alpha(0.5), fontSize: 10 }}
          >
            {desc}
          </Text>
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
      {transitions.map(({ item, key, props }) =>
        item ? (
          <Border
            key={key}
            position="absolute"
            bottom={0}
            left={0}
            height={2}
            width={width}
            backgroundColor="primary"
            style={{
              transform: props.left.interpolate(l => [{ translateX: l }])
            }}
          />
        ) : null
      )}
    </InputWrapper>
  );
};

Comp.defaultProps = {
  circleSize: 25
};

export default Comp;
