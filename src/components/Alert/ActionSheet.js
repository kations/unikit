import * as React from 'react';

import { withThemeProps } from '../../restyle';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Icon from '../Icon';
import Text from '../Text';
import Button from '../Button';

const ActionSheet = ({
  theme,
  textColor,
  type,
  actionSheet,
  actions,
  close,
  buttonSize,
}) => {
  if (actionSheet && actions) {
    return (
      <Flex
        bg={type}
        w="100%"
        justifyContent="flex-end"
        borderTopWidth={1}
        borderTopColor={`${textColor}:setAlpha:0.1`}
      >
        {actions.map(({ label, icon, onPress, ...rest }, i) => {
          return (
            <Button
              onPress={() => {
                close();
                if (onPress) onPress();
              }}
              clean
              width="100%"
              key={`button-${i}`}
              renderLeft={
                icon && (
                  <Icon
                    mr={theme.globals.gap / 2}
                    name={icon}
                    size={20}
                    color={textColor}
                  />
                )
              }
              color={textColor}
              size={buttonSize}
              labelProps={{ fontSize: theme.fonts.p.fontSize }}
              borderTopWidth={1}
              borderTopColor={`${textColor}:setAlpha:0.1`}
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

export default withThemeProps(ActionSheet, 'ActionSheet');
