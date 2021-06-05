import * as React from 'react';
import {
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
  withRepeat,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { getProgress } from '../util';

interface SpringProps {
  to: any;
  from: any;
  exit: any;
  duration?: number;
  defaultDuration?: number;
  delay?: number;
  repeat?: number;
  reverse?: boolean;
  isPresent?: boolean;
  onDidAnimate?: () => void;
}

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const colors = [
  'backgroundColor',
  'borderBottomColor',
  'borderColor',
  'borderEndColor',
  'borderLeftColor',
  'borderRightColor',
  'borderStartColor',
  'borderTopColor',
  'color',
];

const transforms = [
  'x',
  'y',
  'perspective',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'translateX',
  'translateY',
  'skewX',
  'skewY',
];

const getStyleObj = ({
  from = {},
  to = {},
  exit = {},
  duration,
  delay,
  repeat,
}) => {
  const final = {};
  Object.keys(to).forEach((key) => {
    let animationType = duration ? 'timing' : 'spring';
    if (colors.includes(key) || key === 'opacity') animationType = 'timing';

    const fromValue = from[key];
    const toValue = to[key];
    const exitValue = exit[key];

    if (key === 'x') key = 'translateX';
    if (key === 'y') key = 'translateY';
    final[key] = {
      fromValue,
      toValue,
      exitValue,
      animationType,
      trans: transforms.includes(key),
      repeat,
      delay,
    };
  });
  return final;
};

const useSpring = <Props extends SpringProps>({
  to,
  from,
  exit,
  isPresent = true,
  duration,
  defaultDuration = 750,
  delay,
  repeat = 1,
  reverse = false,
  onDidAnimate,
}: Props) => {
  const isMounted = useSharedValue(false);
  const wasMounted = useSharedValue(false);
  const progress = useSharedValue({ enter: 0, exit: 0 });

  const styleObj = React.useMemo(
    () => getStyleObj({ from, to, exit, duration, delay, repeat, isMounted }),
    [
      JSON.stringify(from),
      JSON.stringify(to),
      JSON.stringify(exit),
      duration,
      delay,
      repeat,
    ]
  );

  // console.log({ styleObj, length: Object.keys(styleObj).length });

  const style = useAnimatedStyle(() => {
    const final = { transform: [] };

    Object.keys(styleObj).forEach((key) => {
      const { fromValue, toValue, exitValue, trans, animationType } =
        styleObj[key];

      const config =
        duration || animationType === 'timing'
          ? {
              duration: duration || defaultDuration,
              easing: Easing.bezier(0.5, 0.01, 0, 1),
            }
          : { velocity: 2 };

      const animation = animationType === 'timing' ? withTiming : withSpring;
      const state =
        wasMounted.value === true && isMounted.value === false
          ? 'exit'
          : 'enter';
      const aniValue = withDelay(
        delay || 0,
        withRepeat(
          animation(
            wasMounted.value === true &&
              exitValue !== undefined &&
              isMounted.value === false
              ? exitValue
              : isMounted.value === false && fromValue !== undefined
              ? fromValue
              : toValue,
            { ...config },
            () =>
              onDidAnimate &&
              runOnJS(() => {
                onDidAnimate({
                  key,
                  state,
                });
              })()
          ),
          repeat,
          reverse
        )
      );

      if (trans) {
        final.transform.push({ [key]: aniValue });
      } else {
        final[key] = aniValue;
      }
    });

    // if (final?.transform && final?.transform?.length === 0) {
    //   delete final["transform"];
    // }
    return final;
  });

  React.useEffect(() => {
    isMounted.value = isPresent;
    wasMounted.value = true;
  }, [isMounted, isPresent]);

  return {
    style,
  };
};

export default useSpring;
