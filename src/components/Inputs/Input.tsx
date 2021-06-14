import * as React from 'react';
import { withThemeProps, Touchable } from '../../style';
import { useLayout } from '../../hooks';
import { isNumber } from '../../util';

import Flex from '../Flex';

import Text from '../Text';
import Animate from '../Animate';
import Icon from '../Icon';

import TextInput from './Text';
import Switch from './Switch';
import Slider from './Slider';
import Color from './Color';
import Select from './Select';
import Number from './Number';
import Tabs from './Tabs';
import DatePicker from './DatePicker';
import File from './File';
import Tags from './Tags';

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
      mask: 'date',
    }),
    focus: true,
  },
  timeago: {
    component: TextInput,
    props: () => ({
      renderRight: <DatePicker light size={35} />,
      mask: 'timeago',
      editable: false,
    }),
    focus: true,
  },
  datetime: {
    component: TextInput,
    props: () => ({
      renderRight: <DatePicker light size={35} time />,
      mask: 'datetime',
    }),
    focus: true,
  },
  time: {
    component: TextInput,
    props: () => ({
      mask: 'time',
    }),
    focus: true,
  },
  phone: {
    component: TextInput,
    props: () => ({
      mask: 'phone',
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
    component: TextInput,
    props: () => ({
      mask: 'number',
      renderRight: <Number />,
    }),
    focus: true,
  },
  password: {
    component: TextInput,
    props: () => ({
      textContentType: 'password',
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
    props: ({ clean }) => ({
      trackColor: 'input:darken:5',
    }),
  },
  range: {
    component: Slider,
    props: ({ clean }) => ({
      trackColor: clean ? 'input' : 'input:darken:5',
      mt: 10,
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
  label?: string;
  inputProps?: object;
  roundness: number;
  variant?: string;
  clean?: boolean;
  shadow?: number;
  animationProps?: object;
}

const needsBg = {
  text: true,
  select: true,
  tabs: true,
};

const Input = React.memo(
  ({
    value,
    size = 55,
    error = false,
    theme,
    children,
    type = 'text',
    variant = 'underline',
    indicatorFocusColor = 'primary',
    indicatorBlurColor,
    indicatorSize = 2,
    label,
    roundness,
    animationProps = {}, //{ from: { o: 0 }, to: { o: 1 } },
    clean = false,
    inline = false,
    shadow,
    icon,
    iconSize,
    onChange,
    field,
    labelProps = {},
    bg = 'input',
    style,
    ...rest
  }: Props) => {
    const { onLayout, width, height } = useLayout();
    const [focused, setFocus] = React.useState(false);
    const TYPE = TYPES[type];
    const Comp = TYPE ? TYPE.component : null;
    const WrapperComp = TYPE.wrapperPressable ? Touchable : Flex;

    const radius = isNumber(roundness) ? roundness : theme.globals.roundness;

    const inputProps = {
      value,
      onChange,
      field,
      ...(TYPE && TYPE.props ? TYPE.props({ clean, inline }) : {}),
      setFocus,
      position: 'relative',
      zIndex: type === 'range' ? 999 : 0,
      inline,
      ...rest,
      width: '100%',
      shadow: clean ? shadow : undefined,
      mt: 0,
      roundness: type === 'switch' ? undefined : radius,
      mr: type === 'switch' ? theme.globals.inputGap : undefined,
      size: type === 'switch' ? undefined : size,
      bg: needsBg[type] ? bg : undefined,
      style: {
        textAlign: inline ? 'right' : 'left',
      },
    };

    if (TYPE.inline === false && TYPE.inline !== inline) {
      inline = TYPE.inline;
    }
    if (type === 'switch') {
      inline = true;
      clean = false;
    }

    return (
      <Flex
        borderRadius={radius}
        position="relative"
        w="100%"
        h="auto"
        onLayout={onLayout}
        style={style}
        {...rest}
      >
        <WrapperComp
          bg={clean ? 'transparent' : bg}
          shadow={clean ? undefined : shadow}
          borderRadius={radius}
          alignItems={inline ? 'flex-end' : undefined}
          justifyContent={inline ? 'center' : undefined}
          minHeight={size}
          h="auto"
          w="100%"
          {...(TYPE.wrapperPressable === true
            ? {
                activeOpacity: 0.9,
                onPress: () => {
                  if (onChange) onChange(value === true ? false : true);
                },
              }
            : {})}
        >
          {label && (
            <Flex
              position={inline ? undefined : 'relative'}
              alignItems="center"
              zIndex={888}
              pointerEvents="none"
              absoluteFill={inline === true}
              px={clean && !inline ? radius : theme.globals.inputGap}
              pt={theme.globals.inputGap / 2}
              pb={
                clean
                  ? theme.globals.inputGap / 1.5
                  : inline
                  ? theme.globals.inputGap / 2
                  : 0
              }
              mb={inline ? 0 : -(theme.globals.inputGap / 2)}
              row
            >
              {icon && (
                <Icon
                  name={icon}
                  mr={theme.globals.inputGap / 2}
                  size={iconSize || size * 0.37}
                />
              )}
              <Text
                font="label"
                color={error ? 'error' : 'text'}
                {...labelProps}
              >
                {`${label} ${typeof error === 'string' ? `(${error})` : ''}`}
              </Text>
            </Flex>
          )}
          {children ? children : <Comp {...inputProps} />}
        </WrapperComp>
        {width > 0 && TYPE.focus && !children && (
          <Flex
            absoluteFill
            borderRadius={radius}
            overflow="hidden"
            pointerEvents="none"
            justifyContent="flex-end"
          >
            <Flex
              bg={indicatorBlurColor || `${bg}:darken:5`}
              height={indicatorSize}
              overflow="hidden"
              flexCenter
            >
              <Animate
                isVisible={focused}
                width={width}
                height={height}
                from={{ s: 0, o: 0 }}
                to={{ s: 1, o: 1 }}
                bg={indicatorFocusColor}
                {...animationProps}
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    if (JSON.stringify(prevProps.value) !== JSON.stringify(nextProps.value)) {
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

export default withThemeProps(Input, 'Input');
