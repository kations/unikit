import * as React from "react";
import Animated from "react-native-reanimated";
import { useMemoOne } from "use-memo-one";

const {
  Clock,
  Value,
  set,
  add,
  multiply,
  cond,
  eq,
  abs,
  sub,
  not,
  diff,
  lessThan,
  greaterThan,
  useCode,
  divide,
  modulo,
  proc,
  min: min2,
} = Animated;

export const min = (...args) => args.reduce((acc, arg) => min2(acc, arg));

export const moving = (
  position,
  minPositionDelta = 1e-3,
  emptyFrameThreshold = 5
) => {
  const delta = diff(position);
  const noMovementFrames = new Value(0);
  return cond(
    lessThan(abs(delta), minPositionDelta),
    [
      set(noMovementFrames, add(noMovementFrames, 1)),
      not(greaterThan(noMovementFrames, emptyFrameThreshold)),
    ],
    [set(noMovementFrames, 0), 1]
  );
};

export const snapPoint = (value, velocity, points) => {
  const point = add(value, multiply(0.2, velocity));
  const diffPoint = (p) => abs(sub(point, p));
  const deltas = points.map((p) => diffPoint(p));
  const minDelta = min(...deltas);
  return points.reduce(
    (acc, p) => cond(eq(diffPoint(p), minDelta), p, acc),
    new Value()
  );
};

export const bInterpolate = proc((value, origin, destination) =>
  add(origin, multiply(value, sub(destination, origin)))
);

export const useValues = (values, deps) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemoOne(() => values.map((v) => new Value(v)), deps);

export const useClocks = (numberOfClocks, deps) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemoOne(() => new Array(numberOfClocks).fill(0).map(() => new Clock()), [
    deps,
  ]);

export const useDiff = (node, deps) => {
  const [dDiff] = useValues([0], deps);
  useCode(() => set(dDiff, diff(node)), [dDiff, node]);
  return dDiff;
};

export const addTo = proc((value, node) => set(value, add(value, node)));

export const subTo = proc((value, node) => set(value, sub(value, node)));

export const multiplyTo = proc((value, node) =>
  set(value, multiply(value, node))
);

export const divideTo = proc((value, node) => set(value, divide(value, node)));

export const moduloTo = proc((value, node) => set(value, modulo(value, node)));
