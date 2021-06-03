import * as React from 'react';
import { withThemeProps } from '../../style';

import Flex from '../Flex';
import Text from '../Text';
import Avatar from '../Avatar';
import Icon from '../Icon';

const iconTypes = {
  success: 'check',
  error: 'x',
  warning: 'alert-triangle',
};

const Toast = ({
  theme,
  type = 'surface',
  icon = true,
  title,
  message,
  close,
  ...rest
}) => {
  return (
    <Flex
      w="100%"
      position="relative"
      borderRadius={theme.globals.roundness}
      p={theme.spacing.s}
      pl={theme.spacing.m}
      bg={type}
      shadow={5}
      row
      justifyContent="space-between"
      pointerEvents="box-none"
      alignItems="center"
    >
      <Flex alignItems="center" row>
        {(icon && iconTypes[type]) || (icon !== true && icon) ? (
          <Avatar
            bg="surface"
            borderRadius={15}
            onPress={close}
            mr={theme.spacing.m}
            size={30}
          >
            <Icon
              color={type}
              name={icon === true ? iconTypes[type] : icon}
              size={20}
              animate
              delay={300}
              duration={1200}
            />
          </Avatar>
        ) : null}
        <Text colorAware={type}>{message}</Text>
      </Flex>

      <Avatar
        bg={type}
        borderRadius={theme.globals.roundness}
        onPress={close}
        size={34}
        roundness={0}
      >
        <Icon name="x" size={20} />
      </Avatar>
    </Flex>
  );
};

export default withThemeProps(Toast, 'Toast');
