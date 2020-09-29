import * as React from "react";
import Animated, { Easing } from "react-native-reanimated";

export const bin = (value) => (value ? 1 : 0);

const {
  Value,
  cond,
  block,
  set,
  Clock,
  spring,
  startClock,
  stopClock,
  timing,
  neq,
  SpringUtils,
  not,
  clockRunning,
  divide,
  diff,
} = Animated;

export const defaultSpringConfig = SpringUtils.makeDefaultConfig();

export const delayAni = (node, duration) => {
  const clock = new Clock();
  return block([
    timing({ clock, from: 0, to: 1, duration }),
    cond(not(clockRunning(clock)), node),
  ]);
};

export const withTransition = ({ value, customConfig = {}, loop }) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    frameTime: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };
  const config = {
    toValue: new Value(0),
    duration: 250,
    easing: Easing.linear,
    ...customConfig,
  };

  const looping = loop
    ? [
        cond(state.finished, [
          stopClock(clock),
          set(state.finished, 0),
          set(state.position, 0),
          set(state.time, 0),
          set(state.frameTime, 0),
          startClock(clock),
        ]),
      ]
    : [];

  return block([
    startClock(clock),
    cond(neq(config.toValue, value), [
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.finished, 0),
      set(config.toValue, value),
    ]),
    ...looping,
    timing(clock, state, config),
    state.position,
  ]);
};

export const withSpringTransition = ({
  value,
  start,
  customConfig = defaultSpringConfig,
  loop,
}) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(start),
    time: new Value(0),
    active: new Value(0),
  };
  const config = {
    toValue: value,
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
    ...customConfig,
  };

  const looping = loop
    ? [
        cond(state.finished, [
          stopClock(clock),
          set(state.finished, 0),
          set(state.position, 0),
          set(state.time, 0),
          set(state.velocity, 0),
          startClock(clock),
        ]),
      ]
    : [cond(state.finished, [stopClock(clock), set(state.finished, 0)])];

  return block([
    startClock(clock),
    spring(clock, state, config),
    ...looping,
    state.position,
  ]);
};

export const withTimingTransition = withTransition;
