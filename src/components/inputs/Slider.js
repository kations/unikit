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

const Comp = ({ value, style, onChange, min, max, steps, ticks }) => {
  const theme = useTheme();

  const [state, setState] = useState({
    width: 0,
    left: 0,
    dx: 0,
    swipe: false
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
    setState({ ...state, left: left });
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
          let moveX = state.left + dx;
          setState({ ...state, swipe: true, dx: dx });
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
            shadow={5}
          />
        </Box>
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
      </Pan>
    </View>
  );
};

Comp.defaultProps = {
  min: 0,
  max: 100,
  steps: 1,
  ticks: 10
};

export default Comp;
