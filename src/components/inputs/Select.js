import React, { useState, useEffect } from "react";
import styled, { withTheme } from "styled-components";
import { View, TouchableOpacity, Text } from "react-native";
import { useSpring, animated } from "react-spring";

import { getProp, getColorSchema } from "../../helper";
import Pan from "../helper/Pan";
import Swiper from "../ui/Swiper";

const Select = styled(Pan)`
  position: relative;
  height: 45px;
  width: 100%;
  background-color: ${p =>
    getColorSchema(p, getProp(p, "mode", "select"), "light").background};
  border-radius: ${p => getProp(p, "borderRadius", "select")}px;

  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
`;

const Item = styled(TouchableOpacity)`
  flex: 1;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Label = styled(Text)`
  font-size: 14px;
  color: ${p =>
    p.active
      ? "#FFF"
      : getColorSchema(p, getProp(p, "mode", "select"), "light").text};
`;

const Indicator = styled(View)`
  position: absolute;
  height: ${p => getProp(p, "indicatorHeight", "select")}px;
  left: 0;
  top: 0;
  background-color: ${p =>
    getColorSchema(p, getProp(p, "mode", "select"), "background").background};
  border-radius: ${p => getProp(p, "borderRadius", "select")}px;
`;

const ContentWrap = styled(Pan)`
  position: relative;
  flex: 1;
  height: 500px;
  overflow: hidden;
`;

const Content = styled(View)`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
`;

const AnimatedIndicator = animated(Indicator);
const AnimatedContent = animated(Content);

const isString = option => {
  return typeof option === "string" ? true : false;
};

const Comp = props => {
  const {
    value,
    onChange,
    style,
    options,
    children,
    indicatorHeight,
    borderRadius
  } = props;

  const selectedIndex = options.findIndex(
    option => option === value || option.value === value
  );

  const [state, setState] = useState({
    moveX: 0,
    moveContentX: 0,
    width: 0,
    swipeIndex: 0,
    index: selectedIndex || 0,
    swipe: false
  });

  const width = state.width / options.length;

  useEffect(() => {
    setState({ ...state, index: selectedIndex, moveX: selectedIndex * width });
  }, [selectedIndex]);

  const springStyle = useSpring({
    x: Math.round(state.swipeIndex * width),
    moveX: state.moveX,
    width: `${width}px`,
    config: { mass: 1, tension: 300, friction: 30 },
    immediate: name => state.swipe && name === "moveX"
  });

  const TabsComp = (
    <Select
      style={style}
      borderRadius={borderRadius}
      onLayout={({ nativeEvent }) => {
        const width = state.width / options.length;
        setState({
          ...state,
          width: nativeEvent.layout.width,
          moveX: width * state.index
        });
      }}
      onStart={() => {
        console.log("start");
        setState({
          ...state,
          swipe: true
        });
      }}
      onSwipe={(direction, panState) => {
        let dx = state.index * width + panState.dx;

        var swipeIndex = springStyle.moveX
          .interpolate([0, state.width], [0, options.length])
          .getAnimatedValue();

        setState({
          ...state,
          moveX: dx,
          swipeIndex: swipeIndex
        });
      }}
      onSwipeEnd={(direction, gestureState) => {
        const { threshold = 0 } = props;
        const { vx } = gestureState;
        let swipeIndex = Math.round(state.swipeIndex);

        // Quick movement
        if (Math.abs(vx) * 10 > threshold) {
          if (vx > 0) {
            swipeIndex = swipeIndex + 1;
          } else {
            swipeIndex = swipeIndex - 1;
          }
        }

        if (swipeIndex < 0) {
          swipeIndex = 0;
        } else if (swipeIndex > options.length - 1) {
          swipeIndex = options.length - 1;
        }

        setState({
          ...state,
          moveX: swipeIndex * width,
          index: swipeIndex,
          swipeIndex: swipeIndex,
          swipe: false
        });
      }}
    >
      {value && (
        <AnimatedIndicator
          style={{
            left: state.swipe ? state.swipeIndex * width : springStyle.x,
            width: `${width}px`
          }}
          indicatorHeight={indicatorHeight}
          borderRadius={borderRadius}
        />
      )}
      {options.map((option, index) => (
        <Item
          active={state.index === index}
          activeOpacity={state.index === index ? 1 : 0.6}
          onPress={() => {
            setState({
              ...state,
              index: index,
              moveX: index * width,
              swipeIndex: index
            });
            if (onChange) {
              onChange(isString(option) ? option : option.value);
            }
          }}
          key={`item-${index}`}
        >
          <Label active={Math.round(state.swipeIndex) === index}>
            {isString(option) ? option : option.label}
          </Label>
        </Item>
      ))}
    </Select>
  );

  if (children) {
    return (
      <View>
        {TabsComp}
        <Swiper
          index={state.index}
          swipeIndex={state.swipeIndex}
          onSwipe={swipeIndex => {
            console.log({ swipeIndex });
            setState({ ...state, swipeIndex: swipeIndex });
          }}
          onSwipeEnd={index => {
            console.log({ index });
            setState({ ...state, index: index, swipeIndex: index });
          }}
        >
          {children}
        </Swiper>
      </View>
    );
  } else {
    return TabsComp;
  }
};

Comp.defaultProps = {
  threshold: 5
};

export default withTheme(Comp);
