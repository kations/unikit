import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { styled, Pressable } from '../../style';
import useSpring from '../../hooks/useSpring';
import Ripple from '../Ripple';

interface AnimateProps {
  from: any;
  to: any;
  onPress?: void;
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
const UnimationPressable = Animated.createAnimatedComponent(Pressable);

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
  as,
  onPress,
  visible = true,
  from = { y: 100, opacity: 0 },
  to = { y: 0, opacity: 1 },
  onDidAnimate,
  exit,
  duration,
  delay,
  repeat,
  reverse,
  ripple,
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
    extraStyle: rest?.style || {},
  });

  React.useEffect(() => {
    setIsPresent(visible);
  }, [visible]);

  const C = React.useMemo(() => {
    if (onPress) {
      return UnimationPressable;
    } else {
      return Unimation;
    }
  }, [ripple, onPress]);

  return (
    <C {...rest} onPress={onPress} style={animated.style}>
      {children}
    </C>
  );
};

export default Animate;
