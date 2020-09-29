import * as React from 'react';
import { withThemeProps } from '../../restyle';
import { useLayout } from '../../hooks';
import { isNumber } from '../../utils';

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

const TYPES = {
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
    props: ({ clean }) => ({
      trackColor: clean ? 'input' : 'input:darken:5',
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

const Input = React.memo(
  ({
    size = 55,
    theme,
    children,
    type = 'text',
    variant = 'underline',
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
    ...rest
  }: Props) => {
    const { onLayout, width, height } = useLayout();
    const [focused, setFocus] = React.useState(false);
    const TYPE = TYPES[type];
    const Comp = TYPE ? TYPE.component : null;

    const radius = isNumber(roundness) ? roundness : theme.globals.roundness;

    const inputProps = {
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
      style: {
        textAlign: inline ? 'right' : 'left',
      },
    };

    if (TYPE.inline === false && TYPE.inline !== inline) {
      inline = TYPE.inline;
    }

    return (
      <Flex
        borderRadius={radius}
        position="relative"
        width="100%"
        height="auto"
        onLayout={onLayout}
        {...rest}
      >
        <Flex
          bg={clean ? 'transparent' : 'input'}
          shadow={clean ? undefined : shadow}
          borderRadius={radius}
          alignItems={inline ? 'flex-end' : undefined}
          justifyContent={inline ? 'center' : undefined}
          minHeight={size}
          height="auto"
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
              pb={clean || inline ? theme.globals.inputGap / 2 : 0}
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
              <Text font="label">{label}</Text>
            </Flex>
          )}
          <Comp {...inputProps} />
        </Flex>
        {width > 0 && TYPE.focus && (
          <Flex
            absoluteFill
            borderRadius={radius}
            overflow="hidden"
            pointerEvents="none"
            justifyContent="flex-end"
          >
            <Flex bg="input:darken:10" height={2} overflow="hidden" flexCenter>
              <Animate
                isVisible={focused}
                width={width}
                height={height}
                from={{ s: 0, o: 0 }}
                to={{ s: 1, o: 1 }}
                bg="primary"
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
    } else {
      return true;
    }
  }
);

export default withThemeProps(Input, 'Input');
