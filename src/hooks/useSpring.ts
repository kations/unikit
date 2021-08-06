import * as React from "react";
import {
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
  withRepeat,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import { isWeb } from "../util";
import { withPause } from "./useSpringHelper";

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
  extraStyle?: object;
}

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};

const colors = [
  "backgroundColor",
  "borderBottomColor",
  "borderColor",
  "borderEndColor",
  "borderLeftColor",
  "borderRightColor",
  "borderStartColor",
  "borderTopColor",
  "color",
];

const transforms = [
  "x",
  "y",
  "perspective",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "translateX",
  "translateY",
  "skewX",
  "skewY",
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
    let animationType = duration ? "timing" : "spring";
    if (colors.includes(key) || key === "opacity") animationType = "timing";

    const fromValue = from[key];
    const toValue = to[key];
    const exitValue = exit[key];

    if (key === "x") key = "translateX";
    if (key === "y") key = "translateY";
    final[key] = {
      key,
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
  paused = false,
  extraStyle = {},
}: Props) => {
  const isMounted = useSharedValue(false);
  const wasMounted = useSharedValue(false);
  const pause = useSharedValue(paused);

  if (isWeb && !duration) duration = 500;

  React.useEffect(() => {
    pause.value = paused;
  }, [paused]);

  const styleObj = React.useMemo(
    () => getStyleObj({ from, to, exit, duration, delay, repeat, isMounted }),
    [
      JSON.stringify(from),
      JSON.stringify(to),
      JSON.stringify(exit),
      duration,
      delay,
      repeat,
      paused,
    ]
  );

  // if (!isWeb) {
  //   return getStyle({ styleObj, isMounted, wasMounted });
  // }

  // console.log({ styleObj, length: Object.keys(styleObj).length });

  const style = useAnimatedStyle(() => {
    let final = { ...extraStyle };
    let t = {};

    Object.keys(styleObj).forEach((key) => {
      const { fromValue, toValue, exitValue, trans, animationType } =
        styleObj[key];

      const config =
        duration || animationType === "timing"
          ? {
              duration: duration || defaultDuration,
              easing: Easing.bezier(0.5, 0.01, 0, 1),
            }
          : { velocity: 2 };

      const animation =
        animationType === "timing" || isWeb ? withTiming : withSpring;
      const state =
        wasMounted.value === true && isMounted.value === false
          ? "exit"
          : "enter";
      const value =
        wasMounted.value === true &&
        exitValue !== undefined &&
        isMounted.value === false
          ? exitValue
          : isMounted.value === false && fromValue !== undefined
          ? fromValue
          : toValue;
      const aniValue = paused
        ? value
        : withDelay(
            delay || 0,
            withRepeat(
              animation(
                value,
                { ...config },
                () =>
                  onDidAnimate &&
                  runOnJS(onDidAnimate)({
                    key,
                    state,
                  })
              ),

              repeat,
              reverse
            )
          );

      if (trans) {
        t[key] = aniValue;
      } else {
        final[key] = aniValue;
      }
    });

    return {
      ...final,
      transform: [
        ...(t.translateY ? [{ translateY: t.translateY }] : []),
        ...(t.translateX ? [{ translateX: t.translateX }] : []),
        ...(t.scale ? [{ scale: t.scale }] : []),
        ...(t.scaleX ? [{ scaleX: t.scaleX }] : []),
        ...(t.scaleY ? [{ scaleY: t.scaleY }] : []),
        ...(t.rotate ? [{ rotate: t.rotate }] : []),
        ...(t.rotateX ? [{ rotateX: t.rotateX }] : []),
        ...(t.rotateY ? [{ rotateY: t.rotateY }] : []),
        ...(t.rotateZ ? [{ rotateZ: t.rotateZ }] : []),
        ...(t.skewX ? [{ skewX: t.skewX }] : []),
        ...(t.skewY ? [{ skewY: t.skewY }] : []),
      ],
    };
  }, [JSON.stringify(styleObj)]);

  React.useEffect(() => {
    isMounted.value = isPresent;
    wasMounted.value = true;
  }, [isMounted, isPresent]);

  return {
    style,
  };
};

export default useSpring;
