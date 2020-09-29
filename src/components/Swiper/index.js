import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View } from 'react-native';

import Flex from '../Flex';
import Touchable from '../Touchable';

import { withThemeProps, createBox } from '../../restyle';
import { useLayout, useGesture, useInterval } from '../../hooks';
import { getProgress, getValueByProgress } from '../../utils';
import Dots from './dots';
import { AnimatedView, useSpring } from '../../spring';
import Icon from '../Icon';

// const Wrapper = styled.View();
// const Arrow = styled.TouchableOpacity();
const Track = createBox(AnimatedView);

export function Swiper(
  {
    activeIndex = 0,
    children,
    vertical = false,
    autoplay = false,
    gesture = true,
    arrows = false,
    arrowProps = { color: '#FFF', strokeWidth: 0.5 },
    arrowWrapperProps = {},
    arrowDisabledAlpha = 0.3,
    dots = false,
    dotsProps = {},
    itemProps = {},
    autoplayTimeout = 3000,
    minDistance = 5,
    triggerDistance = 0.2,
    springConfig = {},
    onSwipe,
    onSwipeEnd,
    renderOnActive = false,
    gestureProps = {},
    gap = 0,
    itemDimension,
    ...rest
  },
  ref
) {
  const [index, setIndex] = useState(activeIndex);
  const [direction, setDirection] = useState(activeIndex);
  const [down, setDown] = useState(false);
  const items = React.Children.toArray(children);
  const { onLayout, width, height } = useLayout();

  if (typeof itemDimension === 'string') {
    itemDimension =
      (parseFloat(itemDimension.replace('%', '')) / 100) * width +
      gap / items.length;
  }

  const dist = useSpring({
    to: vertical
      ? -(index * (itemDimension || height))
      : -(index * (itemDimension || width)),
    immediate: down,
    config: springConfig,
  });

  useInterval(
    () => {
      setIndex((index + 1) % items.length);
    },
    autoplay && !down ? autoplayTimeout : null
  );

  const setNewIndex = (newIndex) => {
    if (newIndex > items.length - 1) {
      newIndex = items.length - 1;
    } else if (newIndex < 0) {
      newIndex = 0;
    }
    if (onSwipeEnd) onSwipeEnd(newIndex);
    setIndex(newIndex);
  };

  useEffect(() => {
    if (down === false) {
      const prev =
        direction === 'forward' ? Math.floor(index) : Math.ceil(index);
      let trigger = index - prev;
      let newIndex =
        Math.abs(trigger) > triggerDistance
          ? trigger < 0
            ? Math.floor(index)
            : Math.ceil(index)
          : prev;
      setNewIndex(newIndex);
    }
  }, [down]);

  const bindGesture = useGesture(
    {
      onMoveShouldSetPanResponderCapture: (e, { dy, dx }) => {
        if (!gesture) {
          return false;
        }
        const allow = Math.abs(vertical ? dy : dx) > minDistance;
        return allow;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e, { dy, dx }) => {
        setDown(true);
      },
      onPanResponderMove: (e, { dy, dx }) => {
        const dist = vertical ? dy : dx;
        const size = vertical ? height : width;
        const currentPosition = index * size - dist;
        const progress = getProgress(0, items.length * size, currentPosition);
        const newIndex = getValueByProgress(0, items.length, progress);
        setDirection(dist < 0 ? 'forward' : 'backwards');
        if (onSwipe) onSwipe(newIndex);
        setIndex(newIndex);
      },
      onPanResponderRelease: (e, { vx, vy }) => {
        const velocity = vertical ? vy : vx;
        if (Math.abs(velocity) * 10 > 5) {
          if (velocity < 0) {
            setIndex(index + 1);
          } else {
            setIndex(index - 1);
          }
        }
        setDown(false);
      },
      ...gestureProps,
    },
    [width, height, down]
  );

  useImperativeHandle(ref, () => ({
    swipeNext: () => {
      setNewIndex(index + 1);
    },
    swipePrev: () => {
      setNewIndex(index - 1);
    },
    swipeTo: (newIndex) => {
      setNewIndex(newIndex);
    },
  }));

  return (
    <Flex
      onLayout={onLayout}
      w="100%"
      overflow="hidden"
      opacity={width < 1 ? 0 : 1}
      relative
      {...rest}
    >
      <Track
        {...bindGesture}
        gesture={gesture}
        {...itemProps}
        style={{
          ...(itemProps.style || {}),
          height: '100%',
          flexDirection: vertical ? 'column' : 'row',
          width: vertical ? '100%' : items.length * width,
          height: vertical ? items.length * height : '100%',
          transform: vertical ? [{ translateY: dist }] : [{ translateX: dist }],
        }}
        webStyle={{
          cursor: 'grab',
        }}
      >
        {items.map((child, i) => {
          const isActive = activeIndex === i;
          return (
            <View
              style={{
                width: vertical ? '100%' : itemDimension || width,
                height: !vertical ? '100%' : itemDimension || height,
                paddingRight: !vertical ? gap : 0,
                paddingBottom: vertical ? gap : 0,
              }}
              key={`swiper-${i}`}
            >
              {!isActive && renderOnActive ? null : child}
            </View>
          );
        })}
      </Track>
      {dots ? (
        <Dots
          items={items}
          vertical={vertical}
          index={index}
          onPress={(index) => setNewIndex(index)}
          springConfig={springConfig}
          {...{ position: vertical ? 'right' : 'bottom', ...dotsProps }}
        />
      ) : null}
      {arrows ? (
        <Flex
          absoluteFill
          row={!vertical}
          alignItems="center"
          justifyContent="space-between"
          pointerEvents="box-none"
          {...arrowWrapperProps}
        >
          <Touchable
            onPress={() => setNewIndex(index - 1)}
            opacity={index > 0 ? 1 : arrowDisabledAlpha}
            key={`arrow-left-${index}`}
          >
            <Icon
              name={vertical ? 'chevronUp' : 'chevronLeft'}
              {...arrowProps}
            />
          </Touchable>
          <Touchable
            onPress={() => setNewIndex(index + 1)}
            opacity={index < items.length - 1 ? 1 : arrowDisabledAlpha}
            key={`arrow-right-${index}`}
          >
            <Icon
              name={vertical ? 'chevronDown' : 'chevronRight'}
              {...arrowProps}
            />
          </Touchable>
        </Flex>
      ) : null}
    </Flex>
  );
}

export default withThemeProps(forwardRef(Swiper), 'Swiper');
