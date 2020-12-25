import * as React from 'react';

import { withThemeProps } from '../../restyle';
import { isDark } from '../../utils';
import Button from '../Button';
import Flex from '../Flex';

const Buttons = ({
  theme,
  close,
  onClose,
  textColor,
  itemKey,
  type,
  confirm,
  actionSheet,
  buttons,
  onConfirm,
  buttonSize,
}) => {
  if (confirm || actionSheet || buttons) {
    if (!buttons) {
      buttons = [
        {
          label: theme.translations.cancel,
          onPress: () => {
            close();
            if (onClose) onClose();
          },
          bg: `${type}:darken:2`,
          color: 'error',
        },
        ...(confirm
          ? [
              {
                label: theme.translations.confirm,
                onPress: () =>
                  onConfirm
                    ? onConfirm({ key: itemKey, close })
                    : alert('onConfirm missing'),
                bg: `primary:darken:5`,
              },
            ]
          : []),
      ];
    }
    return (
      <Flex
        bg={type}
        w="100%"
        justifyContent="flex-end"
        px={theme.globals.gap / 2}
        pb={theme.globals.gap / 2}
        row
      >
        {buttons.map(({ label, onPress, ...rest }, i) => {
          return (
            <Button
              flex={1}
              onPress={() => {
                if (onPress) onPress(close);
              }}
              mx={theme.globals.gap / 2}
              mb={theme.globals.gap / 2}
              key={`button-${i}`}
              size={buttonSize}
              labelProps={{ fontSize: theme.fonts.p.fontSize }}
              {...rest}
            >
              {label}
            </Button>
          );
        })}
      </Flex>
    );
  } else {
    return null;
  }
};

export default withThemeProps(Buttons, 'Buttons');
