import * as React from 'react';
import { withThemeProps } from '../../style';

import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';

const Toast = ({ theme, type = 'surface', title, message, close, ...rest }) => {
  return (
    <Flex
      w="100%"
      position="relative"
      borderRadius={theme.globals.roundness}
      px={theme.spacing.m}
      bg={type}
      shadow={5}
      minHeight={50}
      row
      justifyContent="space-between"
      pointerEvents="box-none"
      alignItems="center"
    >
      <Text colorAware={type}>{message}</Text>
      <Button
        bg={`${type}:darken:5`}
        borderRadius={theme.globals.roundness}
        onPress={close}
        size={34}
      >
        x
      </Button>
    </Flex>
  );
};

export default withThemeProps(Toast, 'Toast');
