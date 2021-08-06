import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Flex, Text, Animate, Touchable } from 'unikit';

import { useNavigation } from '../hooks';

const getProgress = (a, b, v) => {
  return (v - a) / (b - a);
};

export default ({ title = '', top = 0, renderLeft = null }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { navigate } = useNavigation();
  var progress = getProgress(0, 100, top);
  if (progress > 0.5) progress = 0.5;

  return (
    <Animate
      from={{ y: -100 }}
      to={{ y: -(progress * 50 > 15 ? 15 : progress * 50) }}
      position="absolute"
      l={0}
      t={10}
      r={0}
      zIndex={9999}
    >
      <Animate
        from={{ opacity: 0 }}
        to={{ opacity: progress * 2 }}
        bg="surface:setAlpha:0.95"
        shadow={55}
        absoluteFill
      />
      <Flex
        px={30}
        h={60}
        alignItems="center"
        w="100%"
        justifyContent="space-between"
        row
        relative
      >
        <Flex>{renderLeft}</Flex>
        <Flex absoluteFill pointerEvents="box-none" center>
          <Touchable onPress={() => navigate('Home')}>
            <Text font="h4" color="primary" bold>
              unikit
              <Text font="h4" color="text">{`${
                title ? ` ${title}` : ''
              }`}</Text>
            </Text>
          </Touchable>
        </Flex>
        <Flex />
      </Flex>
    </Animate>
  );
};
