import React, { useState } from "react";
import color from "color";
import { View, Dimensions, TouchableOpacity, Text } from "react-native";
import { useTransition, animated } from "react-spring/native";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import Flex from "../primitives/Flex";

import Switch from "./Switch";
import TextInput from "./TextInput";
import DatePicker from "./DatePicker";
import Slider from "./Slider";
import Color from "./Color";
import Select from "./Select";
import Number from "./Number";

const types = {
  text: TextInput,
  select: Select,
  switch: Switch,
  date: DatePicker,
  range: Slider,
  color: Color,
  number: Number
};

const typesProps = {
  switch: {
    direction: "row",
    alignItems: "center",
    paddingBottom: 15
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
    <Flex
      as={type === "switch" ? TouchableOpacity : undefined}
      onPress={() => {
        if (onChange) {
          onChange(!value);
        }
      }}
      onLayout={event => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
      flexDirection={direction || TypeProps.direction || "column"}
      justifyContent="space-between"
      alignItems={TypeProps.alignItems || "flex-start"}
      backgroundColor="surface"
      height="auto"
      minHeight={55}
      padding={15}
      overflow="hidden"
      activeOpacity={0.8}
      borderRadius={3}
      paddingBottom={TypeProps.paddingBottom || 4}
      style={style}
      {...rest}
    >
      <Flex>
        <Text
          style={{
            fontSize: ["switch"].indexOf(type) === -1 ? 12 : 15,
            color: error
              ? theme.colors.error
              : focused
              ? theme.colors.primary
              : theme.colors.text
          }}
        >
          {label}
        </Text>
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
          {...rest}
        />
      ) : null}
      {children
        ? React.Children.only(
            React.cloneElement(children, {
              setFocus,
              onChange,
              value,
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
    </Flex>
  );
};

Comp.defaultProps = {
  circleSize: 25
};

export default Comp;
