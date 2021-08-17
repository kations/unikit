import * as React from "react";
import { withThemeProps, Touchable } from "../../style";
import { useLayout } from "../../hooks";
import { isNumber } from "../../util";

import Flex from "../Flex";

import Text from "../Text";
import Animate from "../Animate";

import TextInput from "./Text";
import Switch from "./Switch";
import Slider from "./Slider";
import Color from "./Color";
import Select from "./Select";
import Number from "./Number";
import Tabs from "./Tabs";
import DatePicker from "./DatePicker";
import File from "./File";
import Tags from "./Tags";

const TYPES = {
  tags: {
    component: Tags,
    props: () => ({}),
    focus: true,
  },
  color: {
    component: TextInput,
    props: () => ({
      renderRight: <Color height="65%" minHeight={35} />,
    }),
    focus: true,
  },
  date: {
    component: TextInput,
    props: () => ({
      renderRight: <DatePicker light size={35} />,
      mask: "date",
    }),
    focus: true,
  },
  timeago: {
    component: TextInput,
    props: () => ({
      renderRight: <DatePicker light size={35} />,
      mask: "timeago",
      editable: false,
    }),
    focus: true,
  },
  datetime: {
    component: TextInput,
    props: () => ({
      renderRight: <DatePicker light size={35} time />,
      mask: "datetime",
    }),
    focus: true,
  },
  time: {
    component: TextInput,
    props: () => ({
      mask: "time",
    }),
    focus: true,
  },
  phone: {
    component: TextInput,
    props: () => ({
      mask: "phone",
    }),
    focus: true,
  },
  tabs: {
    component: Tabs,
    props: () => ({
      size: 40,
    }),
  },
  number: {
    component: Number,
    props: () => ({
      mask: "number",
    }),
    focus: true,
  },
  password: {
    component: TextInput,
    props: () => ({
      textContentType: "password",
      secureTextEntry: true,
    }),
    focus: true,
  },
  text: { component: TextInput, focus: true },
  textarea: {
    component: TextInput,
    props: () => ({
      multiline: true,
      numberOfLines: 3,
    }),
    focus: true,
  },
  switch: {
    component: Switch,
    wrapperPressable: true,
  },
  range: {
    component: Slider,
    props: ({ clean }) => ({
      trackColor: clean ? "input" : "input:darken:5",
      mt: 50,
    }),
  },
  select: {
    component: Select,
    inline: false,
  },
  file: {
    component: File,
    inline: false,
  },
};

interface Props {
  theme: object;
  children?: React.ReactNode;
  type?: string;
  labelPosition?: "top" | "left";
  label?: string;
  inputProps?: object;
  roundness: number;
  clean?: boolean;
  shadow?: number;
  animationProps?: object;
}

const needsBg = {
  text: true,
  date: true,
  select: true,
  phone: true,
  number: true,
  textarea: true,
  password: true,
  timeago: true,
  time: true,
  datetime: true,
};

const needsAutoHeight = {
  textarea: true,
  file: true,
  select: true,
};

const Input = React.memo(
  ({
    value,
    labelPosition = "top",
    size = 55,
    error = false,
    theme,
    children,
    type = "text",
    indicatorFocusColor = "primary",
    indicatorBlurColor,
    indicatorSize = 2,
    label,
    roundness,
    animationProps = {}, //{ from: { o: 0 }, to: { o: 1 } },
    clean = false,
    shadow,
    icon,
    iconSize,
    onChange,
    field,
    labelProps = {},
    bg = "input",
    style,
    mt,
    mr,
    ml,
    mb,
    ...rest
  }: Props) => {
    const [focused, setFocus] = React.useState(false);
    const TYPE = TYPES[type];
    const Comp = TYPE ? TYPE.component : null;

    const radius = isNumber(roundness) ? roundness : theme.globals.roundness;
    const labelPositionStyle =
      labelPosition === "top"
        ? { pb: 5 }
        : {
            pl: 10,
            pr: 15,
            height: size,
            zIndex: 100,
            center: true,
          };

    const inputProps = {
      value,
      onChange,
      field,
      ...(TYPE && TYPE.props ? TYPE.props({ clean }) : {}),
      setFocus,
      position: "relative",
      zIndex: type === "range" ? 999 : 0,
      ...rest,
      width: "100%",
      roundness: type === "switch" ? undefined : radius,
      size: type === "switch" ? undefined : size,
      bg: needsBg[type] ? bg : undefined,
      textAlign: labelPosition === "top" ? undefined : "right",
    };

    return (
      <Flex
        w="100%"
        mb={mb}
        {...rest}
        bg={needsBg[type] && labelPosition !== "top" ? bg : undefined}
        row={labelPosition !== "top"}
        justifyContent={
          labelPosition !== "top" ? "space-between" : "flex-start"
        }
        borderRadius={radius}
        relative
      >
        {label ? (
          <Flex pointerEvents="none" {...labelPositionStyle}>
            <Text font="label" {...labelProps}>
              {label}
            </Text>
          </Flex>
        ) : null}
        <Flex
          flex={1}
          h={children || needsAutoHeight[type] ? "auto" : size}
          borderRadius={radius}
          justifyContent="center"
          relative
        >
          <Animate
            visible={focused}
            from={{ scale: 0.9, opacity: 0 }}
            to={{ scale: 1, opacity: 1 }}
            bg="primary"
            borderRadius={radius + indicatorSize}
            l={-indicatorSize}
            t={-indicatorSize}
            r={-indicatorSize}
            b={-indicatorSize}
            //duration={500}
            absolute
          />
          {children ? children : <Comp {...inputProps} />}
        </Flex>
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    if (nextProps.type === "select" && nextProps.multi) {
      return false;
    } else if (
      JSON.stringify(prevProps.value) !== JSON.stringify(nextProps.value)
    ) {
      return false;
    } else if (prevProps.needsDoc || nextProps.needsDoc) {
      return false;
    } else if (prevProps.children) {
      return false;
    } else {
      return true;
    }
  }
);

export default withThemeProps(Input, "Input");
