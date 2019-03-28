import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native-web";
import { useSpring, animated } from "react-spring";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import Pan from "../helper/Pan";
import Swiper from "../ui/Swiper";
import Box from "../primitives/Box";

const AnimatedIndicator = animated(View);

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
    borderRadius,
    swipeIndex,
    hideLabels,
    ...rest
  } = props;

  const theme = useTheme();
  const { select, item, label, indicator } = defaultStyle(props, theme);
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
    if (selectedIndex !== state.index) {
      setState({
        ...state,
        index: selectedIndex,
        moveX: selectedIndex * width,
        swipeIndex: selectedIndex
      });
    }
    if (swipeIndex !== state.swipeIndex) {
      setState({
        ...state,
        moveX: swipeIndex * width,
        swipeIndex: swipeIndex
      });
    }
  }, [selectedIndex, swipeIndex]);

  const springStyle = useSpring({
    x: Math.round(state.swipeIndex * width),
    moveX: state.moveX,
    width: `${width}px`,
    config: { mass: 1, tension: 300, friction: 30 },
    immediate: name => state.swipe && name === "moveX"
  });

  const TabsComp = (
    <Box
      as={Pan}
      style={StyleSheet.flatten([select, style])}
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
          style={StyleSheet.flatten([
            indicator,
            {
              left: state.swipe ? state.swipeIndex * width : springStyle.x,
              width: width
            }
          ])}
          indicatorHeight={indicatorHeight}
          borderRadius={borderRadius}
        />
      )}
      {options.map((option, index) => (
        <TouchableOpacity
          style={item}
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
              console.log(isString(option) ? option : option.value);
              onChange(isString(option) ? option : option.value);
            }
          }}
          key={`item-${index}`}
        >
          {!hideLabels && (
            <Text style={label} active={Math.round(state.swipeIndex) === index}>
              {isString(option) ? option : option.label}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </Box>
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

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    select: {
      position: "relative",
      height: 45,
      width: "auto",
      backgroundColor: getProp(props, theme, "backgroundColor", "select"),
      borderRadius: getProp(props, theme, "borderRadius", "select"),
      flexDirection: "row",
      justifyContent: "space-between",
      overflow: "hidden"
    },
    item: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center"
    },
    label: {
      fontSize: 14,
      color: getProp(props, theme, "color", "select", "backgroundColor")
    },
    indicator: {
      position: "absolute",
      height: getProp(props, theme, "indicatorHeight", "select"),
      left: 0,
      top: 0,
      backgroundColor: getProp(props, theme, "indicatorColor", "select"),
      borderRadius: getProp(props, theme, "borderRadius", "select")
    }
  });

Comp.defaultProps = {
  threshold: 5
};

export default Comp;
