import "setimmediate";
import * as React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

import { withSpringTransition, withTimingTransition, bin } from "./transitions";
import { interpolateColor } from "./colors";

const useMemoOne = React.useMemo;
const isWeb = Platform.OS === "web";
const isAndroid = Platform.OS === "android";
export const AnimatedTouchable = Animated.createAnimatedComponent(
  TouchableOpacity
);
export const AnimatedView = Animated.createAnimatedComponent(View);

const {
  Value,
  set,
  cond,
  add,
  multiply,
  lessThan,
  abs,
  modulo,
  round,
  interpolate,
  divide,
  sub,
  color,
  Extrapolate,
  useCode,
  createAnimatedComponent,
} = Animated;

//TODO MOCK API
export const useSpring = ({
  from,
  to,
  config = {},
  immediate,
  loop,
  delay = 0,
}) => {
  const start = useMemoOne(() => (from !== undefined ? from : to), []);
  const hook = config.duration ? withTimingTransition : withSpringTransition;
  const value = useMemoOne(() => new Value(0), []);
  useCode(() => set(value, typeof to === "boolean" ? bin(to) : to), [
    to,
    value,
  ]);

  const transition = useMemoOne(
    () =>
      hook({
        value,
        start,
        customConfig: config,
        immediate,
        loop,
        delay,
      }),
    [value]
  );
  return transition;
};

export const intColorWeb = (value, { color }) => {
  return color;
};

export const intColorNative = (value, { inputRange, outputRange }) => {
  return interpolateColor(value, {
    inputRange,
    outputRange,
  });
};

export const intColor = isWeb || isAndroid ? intColorWeb : intColorNative;

export {
  createAnimatedComponent,
  Animated,
  cond,
  add,
  multiply,
  lessThan,
  abs,
  modulo,
  round,
  interpolate,
  divide,
  sub,
  color,
  Extrapolate,
  Value,
};

export * from "./colors";
