import * as React from 'react';

import { styled, withThemeProps } from '../../restyle';

import TextInput from './Text';
import Icon from '../Icon';
import Flex from '../Flex';
import Button from '../Button';

import Animate from '../Animate';
import { isNumber } from '../../utils';

const Comp = ({
  theme,
  size = 50,
  value = [],
  onChange,
  textInputProps = {},
  placeholder = 'Add Tag...',
  submitOnString = [' ', ','],
  setFocus,
  roundness,
  ...rest
}) => {
  const [text, setText] = React.useState('');
  const submit = () => {
    if (text.length > 0) {
      const newArray = value;
      newArray.push(text);
      onChange(newArray);
      setText('');
    }
  };
  const revert = (index) => {
    if (index === undefined) setText(value[value.length - 1]);
    const newArray = value;
    if (index !== undefined) {
      newArray.splice(index, 1);
    } else {
      newArray.splice(-1, 1);
    }
    onChange(newArray);
  };
  return (
    <Flex
      w="100%"
      borderRadius={isNumber(roundness) ? roundness : theme.globals.roundness}
      row
      relative
      wrap
      {...rest}
      bg="input"
      alignItems="center"
    >
      {value?.map((string, index) => (
        <Animate from={{ opacity: 0, x: 0, y: 10 }} key={`pill-${index}`}>
          <Button
            renderRight={<Icon name="x" color="#FFF" size={15} lineWidth={1} />}
            size={size * 0.66}
            ml={theme.globals.inputGap / 2}
            onPress={() => revert(index)}
          >
            {string}
          </Button>
        </Animate>
      ))}
      <TextInput
        value={text}
        onChange={(value) => {
          console.log({ value });
          if (
            value.length > 1 &&
            submitOnString.indexOf(value.substr(value.length - 1)) > -1
          ) {
            submit();
          } else {
            setText(value);
          }
        }}
        placeholder={placeholder}
        onSubmitEditing={() => submit()}
        {...textInputProps}
        style={{ width: 'auto', flex: 1 }}
        setFocus={setFocus}
      />
    </Flex>
  );
};

export default withThemeProps(Comp, 'Tags');
