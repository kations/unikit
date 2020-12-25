import React, { useState, useEffect } from 'react';

import { withThemeProps } from '../../restyle';
import { useLayout } from '../../hooks';
import { AnimatedView, useSpring, Animated } from '../../spring';
import Text from '../Text';
import Icon from '../Icon';
import Touchable from '../Touchable';
import Flex from '../Flex';

const { concat } = Animated;

// const Trigger = styled.TouchableOpacity(({ theme }) => ({
//   width: '100%',
//   borderRadius: theme.globals.roundness,
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   web: {
//     cursor: 'pointer',
//   },
// }));

// const Content = styled.View(({ theme }) => ({
//   width: '100%',
//   borderRadius: theme.globals.roundness,
// }));

const Collapsible = ({
  onPress,
  theme,
  collapsed = true,
  trigger = 'Trigger',
  triggerColor = '#FFF',
  spacing = 15,
  font = 'default',
  renderTriger,
  triggerProps = {},
  contentProps = {},
  icon = 'chevronDown',
  iconColor = 'primary',
  iconSize = 20,
  children,
  ...rest
}) => {
  const [open, setOpen] = useState(!collapsed);
  const { onLayout, height } = useLayout();

  useEffect(() => {
    setOpen(!collapsed);
  }, [collapsed]);

  const size = useSpring({
    to: open ? height : 0,
  });

  const deg = useSpring({
    to: open ? 180 : 0,
  });

  const renderArrow = (
    <AnimatedView
      style={{
        transform: [
          {
            rotate: concat(deg, 'deg'),
          },
        ],
      }}
    >
      <Icon name={icon} size={iconSize} color={iconColor} />
    </AnimatedView>
  );

  return (
    <Flex w="100%" {...rest}>
      {trigger && !renderTriger ? (
        <Touchable
          onPress={() => {
            setOpen(!open);
            if (onPress) onPress(!open);
          }}
          bg="primary"
          px={spacing}
          h={44}
          w="100%"
          row
          alignItems="center"
          justifyContent="space-between"
          borderRadius={theme.globals.roundness}
          activeOpacity={0.9}
          {...triggerProps}
        >
          {typeof trigger === 'string' ? (
            <Text font={font} color={triggerColor}>
              {trigger}
            </Text>
          ) : (
            trigger
          )}

          {renderArrow}
        </Touchable>
      ) : renderTriger ? (
        renderTriger({ open, setOpen, renderArrow })
      ) : null}
      <AnimatedView
        relative
        style={{ height: size, width: '100%', overflow: 'hidden' }}
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
      </AnimatedView>
    </Flex>
  );
};

Collapsible.defaultPropTypes = {};

export default withThemeProps(Collapsible, 'Collapsible');
