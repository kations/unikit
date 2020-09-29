import React, { useState, useEffect } from "react";
import { Dimensions, TouchableOpacity, Platform } from "react-native";
import PropTypes from "prop-types";

import styled, { withThemeProps, useTheme } from "../styled";
import { useSpring, AnimatedView } from "../Spring";

import Flex from "../Flex";
import Group from "../Group";
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
import Tabs from "./Tabs";
//import MultiSwitch from "./MultiSwitch";

const Label = styled.Text(({ color, size }) => ({
  color: color,
  font: "label",
}));

const InputWrapper = styled.View(({ theme }) => ({
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  height: "auto",
  borderRadius: theme.globals.roundness,
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
  justifyContent: "flex-end",
}));

const BorderBlur = styled.View(({ borderBlurColor }) => ({
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "100%",
  height: 2,
  width: "100%",
  backgroundColor: borderBlurColor,
}));

const Border = styled(AnimatedView)(({ borderFocusColor }) => ({
  height: 2,
  width: "100%",
  backgroundColor: borderFocusColor,
}));

const AnimatedBorder = ({ focused, width, ...rest }) => {
  const [active, setActive] = useState(0);
  const x = useSpring({
    from: 0,
    to: active * width,
  });

  useEffect(() => {
    if (focused && active === 0) {
      setActive(1);
    } else if (active === 1 && !focused) {
      setActive(2);
      setTimeout(() => {
        setActive(0);
      }, 500);
    }
  }, [focused]);
  return (
    <Border
      {...rest}
      style={{
        left: "-100%",
        opacity: active === 0 ? 0 : 1,
        transform: [{ translateX: x }],
      }}
    />
  );
};

const Surface = styled.View();

const SwitchInput = ({
  label,
  bg,
  clean,
  labelColor,
  size = 35,
  onChange,
  value,
  disabled,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <Flex
      as={TouchableOpacity}
      onPress={
        !disabled
          ? () => {
              if (onChange) {
                onChange(!value);
              }
            }
          : undefined
      }
      activeOpacity={0.8}
      p={theme.globals.inputGap * 0.6}
      pl={theme.globals.inputGap}
      br={theme.globals.roundness}
      row
      w="100%"
      content="space-between"
      align="center"
      bg={bg}
      opacity={disabled ? 0.5 : 1}
      {...rest}
    >
      <Label font="p" color={labelColor}>
        {label}
      </Label>
      <Switch
        size={size}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </Flex>
  );
};

const getVale = (options, value) => {
  const obj = {};
  options.map((option) => {
    obj[option.value || option] = false;
  });
  return { ...obj, ...value };
};

const MultiSwitch = ({
  onChange,
  value,
  options,
  disabled,
  label,
  ...rest
}) => {
  const [obj, setObj] = useState(() => getVale(options, value));

  useEffect(() => {
    console.log({ obj });
    onChange(obj);
  }, [obj]);
  return (
    <Group vertical>
      {options.map((option, index) => {
        var key = option.value ? option.value : option;
        return (
          <SwitchInput
            label={option.label ? option.label : option}
            key={`switch-${index}`}
            value={obj[key]}
            onChange={(v) => setObj({ ...obj, [key]: v })}
            disabled={disabled}
            {...rest}
          />
        );
      })}
    </Group>
  );
};

const CheckboxInput = ({ label, bg, clean, labelColor, onChange, ...rest }) => {
  const theme = useTheme();
  return (
    <Flex
      p={theme.globals.inputGap * 0.6}
      pl={theme.globals.inputGap}
      row
      w="auto"
      align="center"
      bg={bg}
    >
      <Checkbox onChange={onChange} {...rest} />
      <Label font="p" ml={theme.globals.inputGap * 0.5} color={labelColor}>
        {label}
      </Label>
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
  checkbox: CheckboxInput,
  multiselect: MultiSelect,
  multiswitch: MultiSwitch,
  tags: Tags,
  tabs: Tabs,
};

const getTypeProps = ({ theme, clean }) => ({
  range: {
    inputWrap: {
      px: clean ? 0 : theme.globals.inputGap,
      py: theme.globals.inputGap,
      bg: "transparent",
    },
  },
  switch: {
    inputWrap: {
      mt: clean ? theme.globals.inputGap / 2 : 0,
    },
    wrapperProps: {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
    },
    labelProps: {
      size: "p",
    },
  },
  checkbox: {
    inputWrap: {
      px: clean ? 0 : theme.globals.inputGap,
      py: theme.globals.inputGap,
      bg: "transparent",
    },
    labelProps: {
      size: "p",
      style: {
        marginLeft: 10,
      },
    },
  },
  number: {
    inputWrap: {
      mt: !clean ? -theme.globals.inputGap / 2 : 0,
    },
  },
  select: {
    inputWrap: {
      mt: !clean ? -theme.globals.inputGap / 2 : 0,
    },
  },
  color: {
    inputWrap: {
      mt: !clean ? -theme.globals.inputGap / 2 : 0,
    },
  },
  date: {
    inputWrap: {
      mt: !clean ? -theme.globals.inputGap / 2 : 0,
    },
    wrapperProps: {
      readOnly: true,
    },
  },
  text: {
    inputWrap: {
      mt: !clean ? -theme.globals.inputGap / 2 : 0,
    },
  },
  textarea: {
    inputWrap: {
      mt: !clean ? -theme.globals.inputGap / 2 : 0,
    },
    input: {
      numberOfLines: 3,
      multiline: true,
    },
  },
});

export function Input({
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
  clean = true,
  floating = false,
  options,
  shadow,
  borderRadius,
  ...rest
}) {
  const theme = useTheme();
  const [focused, setFocus] = useState(false);
  const [width, setWidth] = useState(Dimensions.get("window").width);

  const InputComp = types[type] || null;

  const TypeProps = getTypeProps({ theme, clean })[type] || {};

  return (
    <InputWrapper
      bg={clean ? "transparent" : "input"}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
      activeOpacity={0.8}
      shadow={clean ? undefined : shadow}
      style={{
        ...style,
        ...(TypeProps.wrapperProps ? TypeProps.wrapperProps.style : {}),
      }}
    >
      {label ? (
        <Flex>
          {label && ["switch", "checkbox"].indexOf(type) === -1 ? (
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
        <Surface
          w="100%"
          bg={clean ? "input" : "transparent"}
          shadow={clean ? shadow : undefined}
          borderRadius={borderRadius || theme.globals.roundness}
          {...TypeProps.inputWrap}
        >
          <InputComp
            bg="transparent"
            onChange={onChange}
            value={value}
            setFocus={setFocus}
            type={type}
            required={required}
            options={options}
            placeholder={placeholder}
            labelColor={error ? "error" : focused ? "primary" : labelColor}
            label={label}
            clean={clean}
            borderRadius={borderRadius}
            {...(TypeProps.input || {})}
            {...rest}
          />
        </Surface>
      ) : null}
      {children ? children : null}

      <BorderWrap size={width} pointerEvents="none">
        <BorderBlur borderBlurColor={borderBlurColor} />
        <AnimatedBorder focused={focused} width={width} bg={borderFocusColor} />
        {/* {transitions.map(({ item, key, props }) =>
          item ? (
            <Border
              key={key}
              borderFocusColor={borderFocusColor}
              {...borderProps}
              style={{
                transform: [{ translateX: props.left }],
                ...borderProps.style,
              }}
            />
          ) : null
        )} */}
      </BorderWrap>
    </InputWrapper>
  );
}

const InputWithTheme = withThemeProps(Input, "Input");

InputWithTheme.propTypes = {
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
    "tags",
  ]),
  value: PropTypes.any,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  labelColor: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  clean: PropTypes.bool,
  floating: PropTypes.bool,
};

InputWithTheme["Text"] = Text;
InputWithTheme["Slider"] = Slider;
InputWithTheme["Tags"] = Tags;
InputWithTheme["Switch"] = Switch;
InputWithTheme["Select"] = Select;
InputWithTheme["Number"] = Number;
InputWithTheme["Checkbox"] = Checkbox;
InputWithTheme["DatePicker"] = DatePicker;
InputWithTheme["Color"] = Color;
InputWithTheme["MultiSelect"] = MultiSelect;

export default InputWithTheme;
