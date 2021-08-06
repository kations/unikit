import * as React from 'react';

import { withThemeProps } from '../../style';
import { isNumber } from '../../util';

import Button from '../Button';
import Icon from '../Icon';
import TextInput from './Text';
import Group from '../Group';

const NumberInput = ({
  theme,
  onChange,
  value,
  steps = 1,
  size = 50,
  ...rest
}) => {
  console.log({ value });
  if (!isNumber(value)) value = 0;
  return (
    <TextInput
      value={value}
      mask="number"
      size={size}
      renderRight={
        <Group
          gap={1}
          h={size * 0.8}
          w="auto"
          t={size * 0.1}
          r={size * 0.1}
          absolute
        >
          <Button
            size={size * 0.8}
            light
            onPress={() => onChange(value - steps)}
            borderRadius={3}
          >
            <Icon name="minus" size={20} />
          </Button>
          <Button
            size={size * 0.8}
            light
            onPress={() => onChange(value + steps)}
            borderRadius={3}
          >
            <Icon name="plus" size={20} />
          </Button>
        </Group>
      }
      {...rest}
    />
  );
};

export default withThemeProps(NumberInput, 'Number');
