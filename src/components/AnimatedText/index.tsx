import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from '../../style/styled';
import useSpring from '../../hooks/useSpring';
import { isWeb } from '../../util';

Animated.addWhitelistedNativeProps({ text: true });

const Unimation = styled(Animated.createAnimatedComponent(Text))();

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const Animate = ({
  children,
  from = { y: 200, opacity: 0 },
  to = { y: 0, opacity: 1 },
  duration,
  delay,
  onDidAnimate = () => {},
  ...rest
}) => {
  const animated = useSpring({
    from: {
      ...from,
      ...(isWeb ? { display: 'inline-block' } : {}),
    },
    to: {
      ...to,
      ...(isWeb ? { display: 'inline-block' } : {}),
    },
    duration,
    delay,
    onDidAnimate,
  });

  return (
    <Unimation {...rest} style={animated.style}>
      {children}
    </Unimation>
  );
};

export default React.memo(Animate, (p, n) => {
  if (JSON.stringify(p.to) !== JSON.stringify(n.to)) {
    return false;
  } else if (p.duration !== n.duration) {
    return false;
  } else if (p.delay !== n.delay) {
    return false;
  }
  return true;
});
