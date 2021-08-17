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
import { withThemeProps, Pressable } from '../../style';
import { useLayout, useUpdateEffect } from '../../hooks';

const AnimatedTouchable = Reanimated.createAnimatedComponent(Pressable);

interface Props {
  children: React.ReactNode;
  direction: 'x' | 'y' | 'xy';
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  snapTo?: { x: number; y: number }[];
  reverseVelocity?: boolean;
  onSnap?: () => void;
  onPress?: () => void;
  onLongPress?: () => void;
  [key: string]: any;
}

const isNumber = (value) => {
  'worklet';
  if (value === 0) return true;
  return runOnJS(isFinite)(value);
};

const Draggable = React.forwardRef(
  (
    {
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
      snap,
      initialSnap,
      onSnap,
      onDragStart,
      onDrag,
      onDragStop,
      onPress,
      onLongPress,
      pressableProps = {},
      reverseVelocity = false,
      wrapperComponent,
      wrapperProps = {},
      activeScale,
      scaleOnHover,
      ...rest
    }: Props,
    ref
  ) => {
    const { width, height, onLayout } = useLayout();
    const translationY = useSharedValue(initialSnap?.y || 0);
    const translationX = useSharedValue(initialSnap?.x || 0);
    const [dragging, setDragging] = React.useState(false);
    const [hover, setHover] = React.useState(false);
    const [press, setPress] = React.useState(true);

    const getBounds = (v, d) => {
      'worklet';
      if (d === 'x') {
        return Math.max(minX, Math.min(v, maxX));
      } else {
        return Math.max(minY, Math.min(v, maxY));
      }
    };

    useUpdateEffect(() => {
      if (isNumber(snap?.x)) translationX.value = withSpring(snap?.x);
    }, [snap]);

    const animateTo = ({
      x,
      y,
      index,
    }: {
      x: number;
      y: number;
      index: number;
    }) => {
      'worklet';
      translationY.value = withSpring(
        isNumber(y) ? y : translationY.value,
        {},
        () => onSnap && direction === 'y' && runOnJS(onSnap)(index)
      );
      translationX.value = withSpring(
        isNumber(x) ? x : translationX.value,
        {},
        () => onSnap && direction === 'x' && runOnJS(onSnap)(index)
      );
    };

    const getSnap = ({ stopX, stopY, absoluteX, absoluteY }) => {
      'worklet';
      const index = snapTo.findIndex((point) => {
        const isAbsolute =
          isNumber(point.top) || isNumber(point.bottom) || false;
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
      return { index, point: snapTo[index] };
    };

    const statehandler = ({ dragging, press }) => {
      setDragging(dragging);
      setPress(press);
    };

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx: GestureContext) => {
        ctx.startY = translationY.value;
        ctx.startX = translationX.value;

        runOnJS(statehandler)({ dragging: true, press: false });
        if (onDragStart) runOnJS(onDragStart)({ x: ctx.startX, y: ctx.startY });
      },
      onActive: (event, ctx: GestureContext) => {
        const pos = {
          x: getBounds(ctx.startX! + event.translationX, 'x'),
          y: getBounds(ctx.startY! + event.translationY, 'y'),
        };
        if (['y', 'xy'].includes(direction)) {
          translationY.value = pos.y;
        } else if (['x', 'xy'].includes(direction)) {
          translationX.value = pos.x;
        }
        if (onDrag) runOnJS(onDrag)(pos);
      },
      onEnd: (event, ctx: GestureContext) => {
        if (snapTo || snapToStart) {
          let velocity =
            direction === 'x'
              ? event.velocityX
              : direction === 'y'
              ? event.velocityY
              : 0;
          if (reverseVelocity) {
            velocity = velocity >= 0 ? -velocity : Math.abs(velocity);
          }
          const snap = getSnap({
            stopX: translationX.value,
            stopY: translationY.value,
            absoluteX: event.absoluteX,
            absoluteY: event.absoluteY,
          });
          console.log({ snap });
          if (snap || snapToStart) {
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
            animateTo({
              x: snap.point?.x,
              y: snap.point?.y,
              index: snap.index,
            });

            if (onDragStop)
              runOnJS(onDragStop)({
                x: isNumber(snap.point?.x) ? snap.point.x : translationX.value,
                y: isNumber(snap.point?.y) ? snap.point.y : translationY.value,
              });
          }
        } else {
          if (onDragStop)
            runOnJS(onDragStop)({
              x: translationX.value,
              y: translationY.value,
            });
        }
        runOnJS(statehandler)({ dragging: false, press: false });
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
          ...(activeScale
            ? [
                {
                  scale: withSpring(
                    dragging || (hover && scaleOnHover) ? activeScale : 1
                  ),
                },
              ]
            : []),
        ],
        cursor: 'grab',
        ...(pressableProps?.style || {}),
      };
    });

    React.useImperativeHandle(ref, () => ({
      snapToIndex: (index) => {
        if (snapTo && snapTo[index]) {
          animateTo({ x: snapTo[index]?.x, y: snapTo[index].y, index: index });
        }
      },
      dragging,
      translationX,
      translationY,
    }));

    const Wrapper = wrapperComponent ? wrapperComponent : React.Fragment;

    return (
      <Wrapper
        {...(wrapperComponent
          ? { translationX, dragging, ...wrapperProps }
          : {})}
      >
        <PanGestureHandler onGestureEvent={gestureHandler} {...rest}>
          <AnimatedTouchable
            onPress={() => {
              if (onPress && press) onPress();
              setPress(true);
            }}
            onPressIn={() => setDragging(true)}
            onPressOut={(e) => setDragging(false)}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onLayout={onLayout}
            {...pressableProps}
            style={reanimatedStyle}
          >
            {children instanceof Function
              ? children({ dragging, translationX })
              : children}
          </AnimatedTouchable>
        </PanGestureHandler>
      </Wrapper>
    );
  }
);

export default withThemeProps(Draggable, 'Draggable');
