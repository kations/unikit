import React from 'react';
import { Platform } from 'react-native';

import { withThemeProps } from '../../restyle';

import Button from '../Button';
import Icon from '../Icon';
import TextInput from './Text';
import Flex from '../Flex';
import Touchable from '../Touchable';
import Checkbox from './Checkbox';
import Switch from './Switch';
import Overlay from '../Overlay';

const Select = ({
  size = 55,
  theme,
  value,
  onChange,
  options = [],
  style,
  placeholder = 'Please select...',
  doneText = 'Done',
  overlayProps = {},
  inputProps = {},
  pickerProps = {},
  inline = false,
  picker = 'checkbox',
  mode = 'list',
  multi = false,
  multiType = 'array',
  bg = 'input',
  name,
  labelSize,
  autoClose = true,
  ...rest
}) => {
  const [visible, setVisible] = React.useState(false);

  if (!inline && multi) inline = true;

  const getValue = () => {
    if (value && options) {
      if (typeof options[0] === 'string') {
        return value;
      } else {
        const option = options.find((e) => e.value === value);
        return option ? option.label : undefined;
      }
    }
    return value;
  };

  const buttonProps =
    mode === 'list'
      ? {
          size: size,
          width: '100%',
          clean: true,
          px: theme.globals.gap,
          color: 'text',
          roundness: 0,
          borderRadius: 0,
          justifyContent:
            picker === 'checkbox' ? 'flex-start' : 'space-between',
          borderTopWidth: 1,
          borderTopColor: `text:setAlpha:0.1`,
          ...pickerProps,
        }
      : {
          bg: 'input',
          color: 'text',
          rounded: true,
          size: size,
          mt: theme.globals.gap / 2,
          mr: theme.globals.gap / 2,
          ...pickerProps,
        };

  const onChangeValue = (v, a) => {
    if (a === true && multi === false) {
      onChange(null);
    } else if (a === false && multi === false) {
      onChange(v);
    } else if (multi === true && multiType === 'array') {
      if (a === true) {
        onChange(value.filter((i) => i !== v));
      } else {
        onChange([...(value || []), v]);
      }
    } else if (multi === true && multiType === 'object') {
      const newValue = { ...(value || {}) };
      if (newValue[v]) {
        newValue[v] = false;
      } else {
        newValue[v] = true;
      }
      onChange(newValue);
    }
    if (autoClose && !multi) {
      setTimeout(() => {
        setVisible(false);
      }, 250);
    }
  };

  const isActive = (v) => {
    if (value) {
      if (multi === false) {
        return v === value;
      } else if (multi === true && multiType === 'array') {
        return value.indexOf(v) > -1;
      } else if (multi === true && multiType === 'object') {
        return value[v] === true;
      }
    } else {
      return false;
    }
  };

  const pickerComp = (
    <Flex w="100%" row={mode === 'pills'} wrap={mode === 'pills'}>
      {options.map((option, i) => {
        const v = option.value || option;
        const a = isActive(v);
        return (
          <Button
            onPress={() => {
              onChangeValue(v, a);
            }}
            key={`button-${i}`}
            renderLeft={
              picker === 'checkbox' ? (
                <Checkbox
                  value={a}
                  mr={10}
                  size={size / 2.5}
                  onChange={() => onChangeValue(v, a)}
                />
              ) : undefined
            }
            renderRight={
              picker === 'checkbox' ? undefined : (
                <Switch
                  value={a}
                  size={size / 1.75}
                  ml={10}
                  trackColor="input:darken:5"
                  activeTrackColor={option.activeTrackColor || undefined}
                  onChange={() => onChangeValue(v, a)}
                />
              )
            }
            labelProps={{ fontSize: labelSize || theme.fonts.p.fontSize }}
            {...buttonProps}
            {...(i === 0 ? { borderTopWidth: 0 } : {})}
          >
            {option.label || option}
          </Button>
        );
      })}
    </Flex>
  );

  return (
    <Flex
      position="relative"
      width="100%"
      borderRadius={theme.globals.roundness}
      bg={mode === 'pills' ? 'transparent' : bg}
      relative
      style={style}
      {...rest}
    >
      {inline ? (
        pickerComp
      ) : (
        <>
          <Touchable
            onPress={() => {
              setVisible(true);
            }}
          >
            <TextInput
              value={value}
              editable={false}
              value={getValue()}
              placeholder={placeholder}
              pointerEvents={Platform.OS === 'web' ? 'all' : 'none'}
              size={size}
            />
          </Touchable>
          <Flex
            position="absolute"
            pr={theme.globals.gap}
            top={0}
            right={0}
            bottom={0}
            flexCenter
            pointerEvents="none"
          >
            <Icon name="chevronDown" size={18} />
          </Flex>
          <Overlay
            maxWidth={450}
            visible={visible}
            onClose={() => setVisible(false)}
            contentProps={{
              bg: 'input',
            }}
            scrollable
          >
            {pickerComp}
          </Overlay>
        </>
      )}
    </Flex>
  );
};

export default withThemeProps(Select, 'Select');
