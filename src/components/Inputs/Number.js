import * as React from 'react';

import { withThemeProps } from '../../restyle';
import Button from '../Button';
import Icon from '../Icon';

import Group from '../Group';

const Number = withThemeProps(
  ({ onChange, value, steps = 1, size = 35, ...rest }) => {
    if (!value) value = 0;
    return (
      <Group minWidth={80} gap={1} {...rest}>
        <Button light size={size} onPress={() => onChange(value - steps)}>
          <Icon name="minus" size={22} />
        </Button>
        <Button light size={size} onPress={() => onChange(value + steps)}>
          <Icon name="plus" size={22} />
        </Button>
      </Group>
    );
  }
);

export default withThemeProps(Number, 'Number');
