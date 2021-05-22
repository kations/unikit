import React from 'react';
import Animated from 'react-native-reanimated';
import styled from '../../style/styled';
import useSpring from '../../hooks/useSpring';
Animated.addWhitelistedNativeProps({ text: true });

const Unimation = styled(Animated.View)();

export const clamp = (value, lowerBound, upperBound) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const Animate = ({
  children,
  from = { y: 200 },
  to = { y: 0 },
  duration,
  delay,
  onDidAnimate = () => {},
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
