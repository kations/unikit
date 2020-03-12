import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import PropTypes from "prop-types";
import { animated, useSpring } from "react-spring/native";

import styled, { withThemeProps } from "../styled";
import { useLayout, useGesture, useInterval } from "../hooks";
import { getProgress, getValueByProgress } from "../util";
import Dots from "./dots";

const Wrapper = styled.View();
const Item = animated(styled.View());
const Track = animated(
  styled.View(({ gesture }) => ({
    web: {
      cursor: gesture ? "grab" : "auto"
    }
  }))
);

export function Swiper(
  {
    activeIndex = 0,
    children,
    vertical = false,
    autoplay = false,
    gesture = true,
    dots = false,
    dotsProps = {},
    itemProps = {},
    autoplayTimeout = 3000,
    minDistance = 5,
    triggerDistance = 0.2,
    springConfig = { config: {} },
    onSwipe,
    onSwipeEnd,
    ...rest
  },
  ref
) {
  const [index, setIndex] = useState(activeIndex);
  const [direction, setDirection] = useState(activeIndex);
  const [down, setDown] = useState(false);
  const items = React.Children.toArray(children);
  const { onLayout, width, height } = useLayout();

  const { dist } = useSpring({
    to: { dist: vertical ? -(index * height) : -(index * width) },
    immediate: down,
    ...springConfig
  });

  useInterval(
    () => {
      setIndex((index + 1) % items.length);
    },
    autoplay && !down ? autoplayTimeout : null
  );

  const setNewIndex = newIndex => {
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
        direction === "forward" ? Math.floor(index) : Math.ceil(index);
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
        setDirection(dist < 0 ? "forward" : "backwards");
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
      }
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
    swipeTo: newIndex => {
      setNewIndex(newIndex);
    }
  }));

  return (
    <Wrapper onLayout={onLayout} w="100%" overflow="hidden" relative {...rest}>
      <Track
        {...bindGesture}
        gesture={gesture}
        h="100%"
        row={!vertical}
        {...itemProps}
        style={{
          ...(itemProps.style || {}),
          width: vertical ? "100%" : items.length * width,
          height: vertical ? items.length * height : "100%",
          transform: vertical ? [{ translateY: dist }] : [{ translateX: dist }]
        }}
      >
        {items.map((child, i) => (
          <Item
            style={{
              width: vertical ? "100%" : width,
              height: !vertical ? "100%" : height
            }}
            key={i}
          >
            {child}
          </Item>
        ))}
      </Track>
      {dots ? (
        <Dots
          items={items}
          vertical={vertical}
          index={index}
          onPress={index => setNewIndex(index)}
          springConfig={springConfig}
          {...{ position: vertical ? "right" : "bottom", ...dotsProps }}
        />
      ) : null}
    </Wrapper>
  );
}

Swiper.propTypes = {
  activeIndex: PropTypes.number,
  children: PropTypes.node.isRequired,
  onSwipe: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  triggerDistance: PropTypes.number,
  minDistance: PropTypes.number, //Initiate animation after swipe this distance. It fix gesture collisions inside ScrollView
  springConfig: PropTypes.object,
  gesture: PropTypes.bool,
  dots: PropTypes.bool,
  dotsProps: PropTypes.object,
  itemProps: PropTypes.object
};

export default withThemeProps(forwardRef(Swiper), "Swiper");
