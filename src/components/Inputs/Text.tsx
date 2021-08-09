import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import dayjs from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
require('dayjs/locale/de');
dayjs.locale('de');
dayjs.extend(customParseFormat);

import { withThemeProps, styled, Pressable } from '../../style';
import { isNumber, isAndroid } from '../../util';
import { useUpdateEffect } from '../../hooks';
import { applyMask, removeMask } from './mask'; //@otw/mask

import Flex from '../Flex';
import Icon from '../Icon';

const StyledTextInput = styled(RNTextInput)();

const getLinesByString = (string) => {
  let array = string.split(/\r*\n/);
  return array.length;
};

const dayjsLangs = {
  de: {
    d: (v) => `Tag${v !== 1 ? 'e' : ''}`,
    m: (v) => `Monat${v !== 1 ? 'e' : ''}`,
    y: (v) => `Jahr${v !== 1 ? 'e' : ''}`,
  },
  en: {
    d: (v) => `day${v !== 1 ? 's' : ''}`,
    m: (v) => `month${v !== 1 ? 's' : ''}`,
    y: (v) => `year${v !== 1 ? 's' : ''}`,
  },
};

const PRE = {
  number: {
    mask: 'a............................',
    validators: {
      'a': /[-|0-9]/,
      '.': /[0-9|\.]/,
    },
  },
  phone: {
    mask: 'a.. (...) ...............',
    validators: {
      'a': /[+]/,
      '.': /[0-9]/,
    },
  },
  date: {
    mask: 'Dd.Mm.yYYY',
    validators: {
      D: /[0-3]/,
      d: /[0-9]/,
      M: /[01]/,
      m: /[0-9]/,
      y: /[12]/,
      Y: /[0-9]/,
    },
  },

  datetime: {
    mask: 'Dd.Mm.yYYY Hh:Tt',
    validators: {
      D: /[0-3]/,
      d: /[0-9]/,
      M: /[01]/,
      m: /[0-9]/,
      y: /[12]/,
      Y: /[0-9]/,
      H: /[0-2]/,
      h: /[0-9]/,
      T: /[0-6]/,
      t: /[0-9]/,
    },
  },
  time: {
    mask: 'Hh:Tt',
    validators: {
      H: /[0-2]/,
      h: /[0-9]/,
      T: /[0-6]/,
      t: /[0-9]/,
    },
  },
};

const MASKS = {
  number: {
    getValue: (v) => {
      v = `${v}`;
      if (v.length > 0) {
        v = v.replace(',', '.');
        v = v.replace(/[.](?=.*[.])/g, '');
      }
      const { mask, validators } = PRE['number'];
      const rawValue = removeMask({ mask, validators, value: v });
      const maskedValue = applyMask({ mask, validators, value: rawValue });

      return maskedValue;
    },
    parseValue: (v, onChange) => {
      console.log({ v });
      if (onChange) {
        if (v.length > 0 && onChange) {
          onChange(v.indexOf('.') > -1 ? parseFloat(v) : parseInt(v));
        } else if (onChange) {
          onChange(null);
        }
      }
    },
    props: {
      keyboardType: 'decimal-pad',
      autoCapitalize: 'none',
    },
  },
  phone: {
    getValue: (v) => {
      if (v.length === 1 && v !== '+') v = `+${v}`;
      const { mask, validators } = PRE['phone'];

      const rawValue = removeMask({ mask, validators, value: v });
      const maskedValue = applyMask({ mask, validators, value: rawValue });
      return maskedValue;
    },
    parseValue: (v, onChange) => {
      const { mask, validators } = PRE['phone'];
      if (onChange) onChange(removeMask({ mask, validators, value: v }));
    },
    props: {
      keyboardType: 'phone-pad',
      autoCapitalize: 'none',
    },
    placeholder: '+49 (123) 45678901',
  },
  timeago: {
    getValue: (v) => {
      const d = dayjs().diff(dayjs(v), 'days');
      const m = dayjs().diff(dayjs(v), 'month');
      const y = dayjs().diff(dayjs(v), 'years');
      const lang = dayjsLangs[dayjs.locale()] || dayjsLangs.en;

      if (d <= 31) return `${d} ${lang.d(d)}`;
      if (d > 31 && y < 1) return `${m} ${lang.m(m)}`;
      return `${y} ${lang.y(y)}${
        m - y * 12 > 0 ? `, ${m - y * 12} ${lang.m(m)}` : ''
      }`;
    },
    parseValue: (v, onChange) => {},
    props: {
      keyboardType: 'number-pad',
      autoCapitalize: 'none',
    },
    placeholder: '0 Tage, 0 Monate, 0 Jahre',
  },
  date: {
    getValue: (v, init) => {
      const { mask, validators } = PRE['date'];
      if (
        v instanceof Date ||
        (init === true && dayjs(v).toDate() instanceof Date)
      ) {
        v = dayjs(v).format('DD.MM.YYYY');
      } else {
        v = `${v}`;
      }

      const rawValue = removeMask({ mask, validators, value: v });
      const maskedValue = applyMask({ mask, validators, value: rawValue });
      return maskedValue;
    },
    parseValue: (v, onChange) => {
      const isValid = dayjs(v, 'DD.MM.YYYY').format('DD.MM.YYYY') === v;
      if (onChange && isValid) {
        onChange(dayjs(v, 'DD.MM.YYYY').toDate());
      } else if ((onChange, v.length === 0)) {
        onChange(null);
      }
    },
    props: {
      keyboardType: 'number-pad',
      autoCapitalize: 'none',
    },
    placeholder: 'dd.mm.yyyy',
  },
  time: {
    getValue: (v, init) => {
      const { mask, validators } = PRE['time'];
      if (
        v instanceof Date ||
        (init === true && dayjs(v).toDate() instanceof Date)
      ) {
        v = dayjs(v).format('HH:MM');
      } else {
        v = `${v}`;
      }

      const rawValue = removeMask({ mask, validators, value: v });
      const maskedValue = applyMask({ mask, validators, value: rawValue });
      return maskedValue;
    },
    parseValue: (v, onChange) => {
      const isValid = dayjs(v, 'HH:mm').format('HH:mm') === v;
      if (onChange && isValid) {
        onChange(dayjs(v, 'HH:mm').toDate());
      } else if ((onChange, v.length === 0)) {
        onChange(null);
      }
    },
    props: {
      keyboardType: 'number-pad',
      autoCapitalize: 'none',
    },
    placeholder: 'hh:mm',
  },
  datetime: {
    getValue: (v, init) => {
      const { mask, validators } = PRE['datetime'];
      if (
        v instanceof Date ||
        (init === true && dayjs(v).toDate() instanceof Date)
      ) {
        v = dayjs(v).format('DD.MM.YYYY HH:mm');
      } else {
        v = `${v}`;
      }

      const rawValue = removeMask({ mask, validators, value: v });
      const maskedValue = applyMask({ mask, validators, value: rawValue });
      return maskedValue;
    },
    parseValue: (v, onChange) => {
      const isValid =
        dayjs(v, 'DD.MM.YYYY HH:mm').format('DD.MM.YYYY HH:mm') === v;
      if (onChange && isValid) {
        onChange(dayjs(v, 'DD.MM.YYYY HH:mm').toDate());
      } else if ((onChange, v.length === 0)) {
        onChange(null);
      }
    },
    props: {
      keyboardType: 'number-pad',
      autoCapitalize: 'none',
    },
    placeholder: 'dd.mm.yyyy hh:mm',
  },
};

const TextInput = ({
  theme,
  as,
  value,
  onChange,
  setFocus,
  onFocus,
  onBlur,
  placeholder,
  placeholderColor = 'placeholder',
  color = 'text',
  multiline,
  numberOfLines,
  size = 50,
  roundness,
  renderLeft = null,
  renderRight = null,
  mask,
  secureTextEntry,
  defaultValue,
  bg = 'input',
  shadow,
  style,
  ...rest
}) => {
  if ((value === undefined || value === null) && defaultValue)
    value = defaultValue;
  const maskObj = MASKS[mask];
  const [secure, setSecure] = React.useState(secureTextEntry);
  const [text, setText] = React.useState(
    value !== undefined && value !== null
      ? `${
          maskObj && maskObj.getValue && value
            ? maskObj.getValue(value, true)
            : value
        }`
      : ''
  );
  const textColor = theme.colors[color] || color;
  const placeholderTextColor =
    theme.colors[placeholderColor] || placeholderColor;

  const getLines = () => {
    const LinesByValue = getLinesByString(value || '');
    return numberOfLines >= LinesByValue ? numberOfLines : LinesByValue;
  };

  useUpdateEffect(() => {
    setText(
      value !== undefined && value !== null
        ? `${maskObj && maskObj.getValue ? maskObj.getValue(value) : value}`
        : ''
    );
  }, [value]);

  return (
    <Flex
      width="100%"
      alignItems="center"
      bg={bg}
      py={multiline ? (isAndroid && !value ? 0 : theme.globals.gap) : undefined}
      borderRadius={isNumber(roundness) ? roundness : theme.globals.roundness}
      shadow={shadow}
      style={style}
      row
    >
      {renderLeft && (
        <Flex height={size} pr={theme.globals.gap} justifyContent="center">
          {React.cloneElement(renderLeft, {
            value,
            onChange,
          })}
        </Flex>
      )}
      <StyledTextInput
        flex={1}
        px={theme.globals.inputGap}
        height={multiline ? 'auto' : size}
        minHeight={size}
        value={text}
        as={as || undefined}
        onChangeText={(v) => {
          if (maskObj) {
            v = maskObj.getValue(v);
          }
          setText(v || '');
          if (maskObj && maskObj.parseValue) {
            v = maskObj.parseValue(v, onChange);
          } else {
            if (onChange) onChange(v);
          }
        }}
        placeholderTextColor={placeholderTextColor}
        underlineColorAndroid="transparent"
        onFocus={() => {
          if (setFocus) {
            setFocus(true);
          }
          if (onFocus) {
            onFocus();
          }
        }}
        onBlur={() => {
          if (setFocus) {
            setFocus(false);
          }
          if (onBlur) {
            onBlur();
          }
        }}
        multiline={multiline}
        numberOfLines={multiline ? getLines() : undefined}
        scrollEnabled={false}
        secureTextEntry={secure}
        hideUnderline
        font="default"
        placeholder={
          maskObj && maskObj.placeholder ? maskObj.placeholder : placeholder
        }
        webStyle={{
          outlineStyle: 'none',
          borderColor: 'transparent',
        }}
        {...rest}
        {...(MASKS[mask] ? MASKS[mask].props : {})}
        style={{
          margin: 0,
          borderWidth: 0,
          fontFamily: theme.globals.fontFamily,
          color: textColor,
          ...theme.fonts.default,
          ...(rest.style || {}),
        }}
      />

      {renderRight && (
        <Flex height={size} pr={theme.globals.gap} justifyContent="center">
          {React.cloneElement(renderRight, {
            value,
            onChange,
          })}
        </Flex>
      )}
      {secureTextEntry && (
        <Pressable
          px={theme.globals.gap}
          height={size}
          onPress={() => setSecure(!secure)}
          flexCenter
        >
          <Icon
            key={secure}
            name={secure ? 'eye' : 'eye-off'}
            size={size / 2.66}
            animate
          />
        </Pressable>
      )}
    </Flex>
  );
};

export default withThemeProps(TextInput, 'TextInput');
