import React, { useState, Fragment, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native-web";
import { useSpring, animated } from "react-spring";

import Pan from "../helper/Pan";
import Flex from "../primitives/Flex";
import Box from "../primitives/Box";
import { useTheme } from "../../style/Theme";

function invlerp(a, b, v) {
  return (v - a) / (b - a);
}

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

const Track = animated(Box);
const Circle = animated(Box);
const Value = animated(Flex);

const Comp = ({
  value,
  style,
  onChange,
  onSwipe,
  min,
  max,
  steps,
  ticks,
  showValue,
  showTicks
}) => {
  const theme = useTheme();

  const [state, setState] = useState({
    width: 0,
    left: 0,
    dx: 0,
    swipe: false,
    value: value || min
  });

  const getSteps = () => {
    const stepArray = [min];
    var minStep = min;
    while (minStep < max) {
      minStep = minStep + ticks;
      stepArray.push(minStep);
    }
    return stepArray;
  };

  useEffect(() => {
    const progress = invlerp(min, max, value);
    const left = lerp(0, state.width, progress);
    //const leftStep = Math.round(left / 100) * 100;
    setState({ ...state, left: left, value });
  }, [value, state.width]);

  const { left } = useSpring({
    to: { left: state.left + state.dx },
    immediate: state.swipe
  });

  return (
    <View
      style={StyleSheet.flatten([
        {
          paddingHorizontal: 15,
          paddingTop: showValue ? 25 : 10,
          paddingVertical: 10,
          width: "100%",
          overflow: "hidden"
        },
        style
      ])}
    >
      <Pan
        onSwipe={(direction, gestureState) => {
          let { dx } = gestureState;
          let newX = state.left + dx;
          let newProgress = invlerp(0, state.width, newX);
          let newValue = Math.round(lerp(min, max, newProgress));
          if (newX > state.width) {
            dx = state.width - state.left;
            newValue = max;
          } else if (newX < 0) {
            dx = -state.left;
            newValue = min;
          }
          setState({ ...state, swipe: true, dx: dx, value: newValue });
          if (onSwipe) onSwipe(newValue);
        }}
        onLayout={({ nativeEvent }) => {
          setState({
            ...state,
            width: nativeEvent.layout.width
          });
        }}
        onSwipeEnd={() => {
          setState({
            ...state,
            dx: 0,
            swipe: false
          });
          const newProgress = invlerp(0, state.width, state.left + state.dx);
          let newValue = Math.round(lerp(min, max, newProgress));
          if (newValue > max) {
            newValue = max;
          } else if (newValue < 0) {
            newValue = min;
          }
          if ((newValue / steps) % 1 != 0) {
            newValue = Math.round(newValue / steps) * steps;
          }
          onChange(newValue);
        }}
      >
        <Box
          position="relative"
          width="100%"
          height="10px"
          borderRadius={10}
          backgroundColor="background"
          marginTop="15px"
          marginBottom="15px"
        >
          <Track
            position="absolute"
            top={0}
            left={0}
            height="10px"
            borderRadius="25px"
            backgroundColor="primary"
            borderRadius="10px"
            style={{ width: left }}
          />
          <Circle
            style={StyleSheet.flatten([
              {
                position: "absolute",
                top: -10,
                left: -15,
                width: "30px",
                height: "30px",
                borderRadius: "25px",
                backgroundColor: "#FFF",
                borderColor: "rgba(0,0,0,0.1)",
                borderWidth: 1,
                cursor: "pointer"
              },
              { transform: left.interpolate(l => [{ translateX: l }]) }
            ])}
          />
          {showValue ? (
            <Value
              backgroundColor="primary"
              alignItems="center"
              justifyContent="center"
              style={StyleSheet.flatten([
                {
                  position: "absolute",
                  bottom: 25,
                  left: -15,
                  width: "30px",
                  height: "auto",
                  paddingVertical: 5,
                  borderRadius: "25px",
                  borderColor: "rgba(0,0,0,0.1)",
                  borderWidth: 1,
                  cursor: "pointer"
                },
                { transform: left.interpolate(l => [{ translateX: l }]) }
              ])}
            >
              <Text style={{ color: "#FFF", fontSize: 10 }}>{state.value}</Text>
            </Value>
          ) : null}
        </Box>
        {showTicks ? (
          <Flex width="100%" flexDirection="row" justifyContent="space-between">
            {getSteps().map(step => (
              <Flex width="1px" alignItems="center">
                <View>
                  <Text
                    style={{
                      fontSize: 10,
                      whiteSpace: "nowrap"
                    }}
                  >
                    {step}
                  </Text>
                </View>
              </Flex>
            ))}
          </Flex>
        ) : null}
      </Pan>
    </View>
  );
};

Comp.defaultProps = {
  min: 0,
  max: 100,
  steps: 1,
  ticks: 10,
  showTicks: true,
  showValue: true
};

export default Comp;
