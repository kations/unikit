import React, { useState } from 'react';
import Animated from 'react-native-reanimated';

import styled from '../../style/styled';
import useSpring from '../../hooks/useSpring';

interface AnimateProps {
  from: any;
  to: any;
  exit: any;
  duration?: number;
  delay?: number;
  visible?: boolean;
  repeat?: number;
  reverse?: boolean;
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
  visible = true,
  from = { y: 100, opacity: 0 },
  to = { y: 0, opacity: 1 },
  onDidAnimate,
  exit,
  duration,
  delay,
  repeat,
  reverse,
  ...rest
}) => {
  const [isPresent, setIsPresent] = useState(visible);
  const animated = useSpring({
    from,
    to,
    exit,
    isPresent,
    duration,
    repeat,
    delay,
    onDidAnimate,
  });

  React.useEffect(() => {
    setIsPresent(visible);
  }, [visible]);

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
  } else if (p.visible !== n.visible) {
    return false;
  }
  return true;
});
