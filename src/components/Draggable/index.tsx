import * as React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  default as Reanimated,
  runOnJS,
} from 'react-native-reanimated';
import { withThemeProps, Touchable } from '../../style';
import { isNumber } from '../../util';
import { useLayout, useUpdateEffect } from '../../hooks';

const AnimatedTouchable = Reanimated.createAnimatedComponent(Touchable);

interface Props {
  children: React.ReactNode;
  direction: 'x' | 'y' | 'xy';
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  snapTo: { x: number; y: number }[];
  onSnap: () => void;
  [key: string]: any;
}

const Draggable = ({
  theme,
  children,
  direction = 'x',
  minX = -9999999,
  maxX = 9999999,
  minY = -9999999,
  maxY = 9999999,
  snapTo,
  snapToStart = false,
  snapFactor = 50,
  initialSnap,
  onSnap,
  onDragStart,
  onDragStop,
  ...rest
}: Props) => {
  const { width, height, onLayout } = useLayout();
  const translationY = useSharedValue(initialSnap?.y || 0);
  const translationX = useSharedValue(initialSnap?.x || 0);
  const [dragging, setDragging] = React.useState(false);

  const getBounds = (v, d) => {
    if (d === 'x') {
      return Math.max(minX, Math.min(v, maxX || B));
    } else {
      return Math.max(minY, Math.min(v, maxY));
    }
  };

  useUpdateEffect(() => {
    if (dragging && onDragStart) onDragStart();
    if (dragging === false && onDragStop) onDragStop();
  }, [dragging]);

  const getSnap = ({ stopX, stopY, absoluteX, absoluteY }) => {
    const index = snapTo.findIndex((point) => {
      const isAbsolute = isNumber(point.top) || isNumber(point.bottom) || false;
      if (isNumber(point.top)) point.y = 0 + point.top;
      if (isNumber(point.bottom)) point.y = theme.height - point.bottom;
      const xFactor = (point.x || 0) - snapFactor;
      const yFactor = (point.y || 0) - snapFactor;
      const xPosition = isAbsolute && direction === 'x' ? absoluteX : stopX;
      const yPosition = isAbsolute && direction === 'y' ? absoluteY : stopY;
      return (
        xFactor <= xPosition &&
        xPosition <= xFactor + snapFactor * 2 &&
        yFactor <= yPosition &&
        yPosition <= yFactor + snapFactor * 2
      );
    });
    console.log({ index });
    return { index, point: snapTo[index] };
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: GestureContext) => {
      ctx.startY = translationY.value;
      ctx.startX = translationX.value;
      setDragging(true);
    },
    onActive: (event, ctx: GestureContext) => {
      if (['y', 'xy'].includes(direction)) {
        translationY.value = getBounds(ctx.startY! + event.translationY, 'y');
      } else if (['x', 'xy'].includes(direction)) {
        translationX.value = getBounds(ctx.startX! + event.translationX, 'x');
      }
    },
    onEnd: (event, ctx: GestureContext) => {
      if (snapTo || snapToStart) {
        const velocity =
          direction === 'x'
            ? event.velocityX
            : direction === 'y'
            ? event.velocityY
            : 0;
        console.log({
          stopX: translationX.value,
          stopY: translationY.value,
          absoluteX: event.absoluteX,
          absoluteY: event.absoluteY,
        });
        const snap = getSnap({
          stopX: translationX.value,
          stopY: translationY.value,
          absoluteX: event.absoluteX,
          absoluteY: event.absoluteY,
        });
        if (snap || snapToStart) {
          console.log({ snap });
          const snapToNext = Math.abs(velocity) * 10 > 5;
          if (snapToNext && velocity > 0 && snapTo[snap.index + 1]) {
            snap.point = snapTo[snap.index + 1];
            snap.index = snap.index + 1;
          } else if (snapToNext && velocity < 0 && snapTo[snap.index - 1]) {
            snap.point = snapTo[snap.index - 1];
            snap.index = snap.index - 1;
          } else if (snap.index === -1 && snapToStart) {
            snap.point = { x: ctx.startX, y: ctx.startY };
          }
          if (snap.point?.offset) {
            snap.point.y = snap.point.y + snap.point.offset;
          }
          if (snap.point?.top !== undefined && snap.point) {
            snap.point.y =
              snap.point.y + snap.point.offset + translationY.value;
          }
          translationY.value = withSpring(
            isNumber(snap.point?.y) ? snap.point.y : translationY.value,
            {},
            () =>
              onSnap && direction === 'y' && runOnJS(() => onSnap(snap.index))()
          );
          translationX.value = withSpring(
            isNumber(snap.point?.x) ? snap.point.x : translationX.value,
            {},
            () =>
              onSnap && direction === 'x' && runOnJS(() => onSnap(snap.index))()
          );
        }
      }
      setDragging(false);
    },
  });

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translationY.value,
        },
        {
          translateX: translationX.value,
        },
      ],
      cursor: 'grab',
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} {...rest}>
      <AnimatedTouchable
        onPressIn={() => setDragging(true)}
        onPressOut={() => setDragging(false)}
        style={reanimatedStyle}
        activeOpacity={1}
        onLayout={onLayout}
      >
        {children instanceof Function ? children({ dragging }) : children}
      </AnimatedTouchable>
    </PanGestureHandler>
  );
};

export default withThemeProps(Draggable, 'Draggable');
