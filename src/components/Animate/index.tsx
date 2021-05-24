import React from 'react';
import Animated from 'react-native-reanimated';

import styled from '../../style/styled';
import useSpring from '../../hooks/useSpring';

interface AnimateProps {
  from: any;
  to: any;
  duration?: number;
  delay?: number;
  onDidAnimate?: () => void;
}

Animated.addWhitelistedNativeProps({ text: true });

const Unimation = styled(Animated.View)();

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const Animate: React.FC<AnimateProps> = ({
  children,
  from = { y: 100, opacity: 0 },
  to = { y: 0, opacity: 1 },
  duration,
  delay,
  onDidAnimate,
  ...rest
}) => {
  const animated = useSpring({
    from,
    to,
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
