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
import type { ColorValue, OpaqueColorValue } from 'react-native';

interface SpringProps {
  to: any;
  from: any;
  duration?: number;
  defaultDuration?: number;
  delay?: number;
  repeat?: number;
  onDidAnimate?: () => void;
}

interface AnimationValue extends SpringProps {
  value: number | Exclude<ColorValue, OpaqueColorValue>;
  animationType: 'spring' | 'timing';
  config: any;
}

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const isColor = (styleKey: string) => {
  'worklet';
  return [
    'backgroundColor',
    'borderBottomColor',
    'borderColor',
    'borderEndColor',
    'borderLeftColor',
    'borderRightColor',
    'borderStartColor',
    'borderTopColor',
    'color',
  ].includes(styleKey);
};

const isTransform = (styleKey: string) => {
  'worklet';
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
  return transforms.includes(styleKey);
};

const getAnimatedValue = ({
  value,
  animationType = 'spring',
  config = {},
  delay = 0,
  repeat = 1,
  onDidAnimate,
  ...rest
}: AnimationValue) => {
  'worklet';
  const animation = animationType === 'timing' ? withTiming : withSpring;
  const aniFunc = withRepeat(
    animation(
      value,
      { ...config, ...rest },
      () => onDidAnimate && runOnJS(onDidAnimate)()
    ),
    repeat,
    true
  );

  if (delay) {
    return withDelay(delay, aniFunc);
  }
  return aniFunc;
};

const useSpring = <Props extends SpringProps>({
  to,
  from = false,
  duration,
  defaultDuration = 750,
  delay,
  repeat = 1,
  onDidAnimate,
}: //exit,
Props) => {
  const isMounted = useSharedValue(false);

  const style = useAnimatedStyle(() => {
    const final = {
      // initializing here fixes reanimated object.__defineProperty bug(?)
      transform: [],
    };

    const animateStyle = to || {};
    const initialStyle = from || {};
    //const exitStyle = exit || {};

    Object.keys(animateStyle).forEach((key) => {
      let animationType = duration ? 'timing' : 'spring';
      if (isColor(key) || key === 'opacity') animationType = 'timing';

      const config =
        duration || animationType === 'timing'
          ? {
              duration: duration || defaultDuration,
              easing: Easing.bezier(0.5, 0.01, 0, 1),
            }
          : { velocity: 2 };
      const aniConfig = { animationType, delay, config, onDidAnimate, repeat };

      const initialValue = initialStyle[key];
      const value = getAnimatedValue({
        value: animateStyle[key],
        ...aniConfig,
      });

      if (key === 'x') key = 'translateX';
      if (key === 'y') key = 'translateY';
      if (initialValue !== null) {
        // if we haven't mounted, or if there's no other value to use besides the initial one, use it.
        if (isMounted.value === false) {
          if (isTransform(key) && final.transform) {
            // this syntax avoids reanimated .__defineObject error
            const transform = {};
            transform[key] = getAnimatedValue({
              value: initialValue,
              ...aniConfig,
            });

            // final.transform.push({ [key]: initialValue }) does not work!
            // @ts-ignore
            final.transform.push({
              [key]: getAnimatedValue({
                value: initialValue,
                ...aniConfig,
              }),
            });
            // console.log({ final })
          } else {
            final[key] = getAnimatedValue({
              value: initialValue,
              ...aniConfig,
            });
          }
          return;
        }
      }

      if (isTransform(key)) {
        final.transform.push({ [key]: value });
      } else {
        final[key] = value;
      }
    });

    // if (final?.transform && final?.transform?.length === 0) {
    //   delete final["transform"];
    // }
    return final;
  });

  React.useEffect(() => {
    isMounted.value = true;
  }, [isMounted]);

  return {
    style,
  };
};

export default useSpring;
