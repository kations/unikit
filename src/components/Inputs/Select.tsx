import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Picker as NativePicker } from '@react-native-picker/picker';

import { withThemeProps, Pressable } from '../../style';
import { isIOS } from '../../util';

import Dropdown from '../Dropdown';
import Button from '../Button';
import Icon from '../Icon';
import Flex from '../Flex';
import TextInput from './Text';

const Picker = ({
  size = 50,
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
  name,
  ...rest
}) => {
  const [show, setShow] = useState(false);

  const renderCheckbox = (option, index) => {
    const label = typeof option === 'string' ? option : option.label;
    const optionValue = typeof option === 'string' ? option : option.value;
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
      if (typeof options[0] === 'string') {
        return value;
      } else {
        const option = options.find((e) => e.value === value);
        return option ? option.label : undefined;
      }
    }
    return value;
  };

  const renderPicker = () => {
    return (
      <NativePicker
        name={name}
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) =>
          onChange ? onChange(itemValue) : null
        }
        itemStyle={{ textAlign: 'center', color: theme.colors.text }}
        {...pickerProps}
        style={[
          {
            width: '100%',
            paddingVertical: theme.globals.inputGap,
            paddingHorizontal: theme.globals.inputGap,
            margin: 0,
            borderRadius: 0,
            backgroundColor: 'transparent',
            fontSize: theme.fonts.p.fontSize,
            color: theme.colors.text,
            ...Platform.select({
              web: {
                outlineWidth: 0,
                outlineColor: 'unset',
                borderColor: 'transparent',
                appearance: 'none',
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

  return (
    <Flex
      width="100%"
      br={theme.globals.roundness}
      relative
      style={style}
      {...rest}
    >
      {isIOS ? null : (
        <Flex
          h={size}
          overflow="hidden"
          bg="input"
          borderRadius={theme.globals.roundness}
        >
          {renderPicker()}
        </Flex>
      )}
      {isIOS ? (
        <Dropdown
          position="center"
          visible={show}
          onClose={() => setShow(false)}
          content={renderPicker()}
          wrapperProps={{
            w: 250,
            r: 0,
            t: 50,
          }}
          {...overlayProps}
        >
          <Pressable
            onPress={() => {
              setShow(!show);
            }}
            w="100%"
            h={size}
          >
            <TextInput
              type="text"
              editable={false}
              value={getValue()}
              placeholder={placeholder}
              pointerEvents={Platform.OS === 'web' ? 'all' : 'none'}
              {...inputProps}
            />
          </Pressable>
        </Dropdown>
      ) : null}
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
    </Flex>
  );
};

export default withThemeProps(Picker, 'Picker');
