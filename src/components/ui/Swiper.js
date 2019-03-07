import React, { useState, useEffect } from "react";
import styled, { withTheme } from "styled-components";
import { View } from "react-native";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";

import { getProp, getColorSchema } from "../../helper";
import Pan from "../helper/Pan";
import Box from "../primitives/Box";

const Root = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

const Wrap = styled(Pan)`
  flex: 1;
  flex-direction: row;
`;

const Content = styled(View)`
  flex: 1;
`;

const AnimatedWrap = animated(Wrap);
const AnimatedContent = animated(Content);

const Comp = props => {
  const {
    index,
    swipeIndex,
    style,
    slideWidth,
    children,
    gap,
    scale,
    ...rest
  } = props;

  const [state, setState] = useState({
    moveX: 0,
    width: slideWidth || 0,
    swipeIndex: index || swipeIndex,
    index: index,
    swipe: false
  });

  useEffect(() => {
    if (index !== state.index) {
      setState({ ...state, index: index, moveX: index * -state.width });
    }
    if (swipeIndex !== state.swipeIndex) {
      setState({
        ...state,
        swipeIndex: swipeIndex,
        moveX: swipeIndex * -state.width
      });
    }
  }, [index, swipeIndex]);

  const getScale = (index, swipeIndex) => {
    let factor = Math.abs(swipeIndex - index);
    if (factor > 1) factor = 1;
    if (factor <= 0.5) {
      return factor;
    } else {
      return 1 - factor;
    }
  };

  const contentSpring = useSpring({
    to: {
      left: state.swipeIndex * -state.width,
      moveX: state.moveX,
      distance:
        state.swipe && scale ? 1 - getScale(state.index, state.swipeIndex) : 1
    },
    config: { mass: 1, tension: 300, friction: 30 },
    immediate: name => state.swipe && name === "moveX"
  });

  return (
    <Root
      onLayout={({ nativeEvent }) => {
        setState({
          ...state,
          width: slideWidth || nativeEvent.layout.width
        });
      }}
      style={style}
      {...rest}
    >
      <AnimatedWrap
        onStart={() => {
          setState({
            ...state,
            swipe: true
          });
        }}
        onSwipe={(direction, gestureState) => {
          let dx = state.index * -state.width + gestureState.dx;
          var swipeIndex = contentSpring.moveX
            .interpolate(
              [0, -state.width * React.Children.count(children)],
              [0, React.Children.count(children)]
            )
            .getAnimatedValue();

          if (props.onSwipe) props.onSwipe(swipeIndex);
          setState({
            ...state,
            moveX: dx,
            swipeIndex: swipeIndex
          });
        }}
        onSwipeEnd={(direction, gestureState) => {
          const { threshold = 0, children } = props;
          const { vx } = gestureState;
          let swipeIndex = Math.round(state.swipeIndex);

          // Quick movement
          if (Math.abs(vx) * 10 > threshold) {
            if (vx > 0) {
              swipeIndex = swipeIndex - 1;
            } else {
              swipeIndex = swipeIndex + 1;
            }
          }

          if (swipeIndex < 0) {
            swipeIndex = 0;
          } else if (swipeIndex > React.Children.count(children) - 1) {
            swipeIndex = React.Children.count(children) - 1;
          }

          if (props.onSwipeEnd) props.onSwipeEnd(swipeIndex);
          setState({
            ...state,
            index: swipeIndex,
            moveX: swipeIndex * -state.width,
            swipeIndex: swipeIndex,
            swipe: false
          });
        }}
        style={{
          left: contentSpring.left,
          width: state.width * React.Children.count(children)
        }}
      >
        {React.Children.map(children, (child, index) => (
          <AnimatedContent
            style={{
              transform: contentSpring.distance.interpolate(d => `scale(${d})`),
              paddingRight: gap
            }}
          >
            {child}
          </AnimatedContent>
        ))}
      </AnimatedWrap>
    </Root>
  );
};

Comp.propTypes = {
  index: PropTypes.number,
  swipeIndex: PropTypes.number,
  threshold: PropTypes.number,
  hysteresis: PropTypes.number,
  children: PropTypes.node.isRequired,
  onSwipe: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  scale: PropTypes.bool
};

Comp.defaultProps = {
  index: 0,
  swipeIndex: 0,
  threshold: 5,
  hysteresis: 0.6
};

export default Comp;
