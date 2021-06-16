import * as React from 'react';

import { withThemeProps } from '../../style';
import Flex from '../Flex';
//import Icon from '../Icon';
import Button from '../Button';

const ActionSheet = ({
  theme,
  type = 'surface',
  actions = [{ label: 'Demo' }, { label: 'Demo' }, { label: 'Demo' }],
  close,
  buttonSize = 44,
}) => {
  return (
    <>
      <Flex
        bg={type}
        p={theme.spacing.s}
        w="100%"
        borderRadius={
          theme.Button?.rounded ? buttonSize / 2 : theme.globals.roundness
        }
        justifyContent="flex-end"
      >
        {actions.map(
          (
            {
              label,
              icon,
              onPress,
              ...rest
            }: {
              label: string;
              icon: string;
              onPress: () => void;
              [key: string]: any;
            },
            i
          ) => {
            return (
              <Button
                onPress={() => {
                  close();
                  if (onPress) onPress();
                }}
                bg={type}
                width="100%"
                key={`button-${i}`}
                labelProps={{ fontSize: theme.fonts.p.fontSize }}
                mb={i === 2 ? 0 : theme.globals.gap / 2}
                {...rest}
              >
                {label}
              </Button>
            );
          }
        )}
      </Flex>
      <Button
        bg={type}
        size={buttonSize}
        color="error"
        mt={theme.spacing.s}
        onPress={close}
      >
        {theme.translations?.close || 'Close'}
      </Button>
    </>
  );
};

export default withThemeProps(ActionSheet, 'ActionSheet');
