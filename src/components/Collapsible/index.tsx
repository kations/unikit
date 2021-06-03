import React, { useState, useEffect } from 'react';
import { withThemeProps } from '../../style';
import { useLayout } from '../../hooks';

import Icon from '../Icon';
import Flex from '../Flex';
import Animate from '../Animate';
import Button from '../Button';

export interface Props {
  children: React.ReactNode;
  onPress: void;
  theme: object;
  collapsed: boolean;
  font?: string;
  trigger: string;
  renderTriger?: void;
  icon?: string;
  iconSize?: number;
  outlined?: boolean;
  clean?: boolean;
  contentProps?: object;
  triggerProps?: object;
  [key: string]: any;
}

const Collapsible = ({
  children,
  onPress,
  theme,
  collapsed = true,
  trigger = 'Trigger',
  spacing = 15,
  font = 'default',
  renderTriger,
  triggerProps = {},
  contentProps = {},
  icon = 'chevron-down',
  iconSize = 20,
  ...rest
}: Props) => {
  const [open, setOpen] = useState(!collapsed);
  const { onLayout, height } = useLayout();

  useEffect(() => {
    setOpen(!collapsed);
  }, [collapsed]);

  return (
    <Flex w="100%" {...rest}>
      {trigger && !renderTriger ? (
        <Button
          onPress={() => {
            setOpen(!open);
            if (onPress) onPress(!open);
          }}
          bg="primary"
          px={spacing}
          w="100%"
          row
          alignItems="center"
          justifyContent="space-between"
          activeOpacity={0.9}
          renderRight={({ color }) => (
            <Animate
              to={{
                rotate: open ? '-180deg' : '0deg',
              }}
            >
              <Icon name={icon} size={iconSize} color={color} />
            </Animate>
          )}
          {...triggerProps}
        >
          {trigger}
        </Button>
      ) : renderTriger ? (
        renderTriger({ open, setOpen })
      ) : null}
      <Animate
        to={{ height: open ? height : 0 }}
        w="100%"
        overflow="hidden"
        relative
      >
        <Flex
          p={spacing}
          collapsable={false}
          onLayout={onLayout}
          absolute
          l={0}
          t={0}
          w="100%"
          borderRadius={theme.globals.roundness}
          {...contentProps}
        >
          {children}
        </Flex>
      </Animate>
    </Flex>
  );
};

export default withThemeProps(Collapsible, 'Collapsible');
