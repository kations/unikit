import React, { useMemo, useEffect } from 'react';
import { Animated } from 'react-native';
import { Path } from 'react-native-svg';

import { isWeb } from '../../util';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  d: string;
  animationType?: string;
  duration?: number;
  delay?: number;
  [key: string]: any;
}

export default ({
  d,
  animationType = 'timing',
  duration = 1000,
  delay = 0,
  progress = 1,
  ...rest
}: Props) => {
  const ref = React.useRef(null);
  const [length, setLength] = React.useState(null);
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  console.log({ progress });

  const animateToProgress = (p: number) => {
    const Animation =
      animationType === 'timing' ? Animated.timing : Animated.spring;
    setTimeout(() => {
      Animation(animatedValue, {
        toValue: 1 * p,
        duration,
        useNativeDriver: true,
      }).start();
    }, delay);
  };

  useEffect(() => {
    animateToProgress(progress);
  }, [progress]);

  React.useEffect(() => {
    if (ref?.current) {
      if (isWeb) {
        setLength(ref?.current?._touchableNode.getTotalLength());
      } else {
        setLength(ref?.current?.getTotalLength());
      }
    }
  }, [ref?.current]);

  const t = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [length, 0],
  });

  return (
    <AnimatedPath
      data-foo="0"
      d={d}
      strokeDasharray={length}
      strokeDashoffset={t}
      ref={ref}
      style={{ opacity: length === null ? 0 : 1 }}
      {...rest}
    />
  );
};
