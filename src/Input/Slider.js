import React, { useState, useEffect } from "react";
import { View, Text, Platform } from "react-native";
import { useSpring, animated } from "react-spring/native";

import Pan from "../Pan";
import styled from "../styled";
import Box from "../Box";

const invlerp = (a, b, v) => {
  return (v - a) / (b - a);
};

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

const SliderWrapper = styled.View(({ theme }) => ({
  paddingHorizontal: theme.globals.inputGap,
  paddingTop: theme.globals.inputGap / 2,
  width: "100%"
}));

const Slider = styled(Box)(
  ({ showValue, showTicks, vertical, sliderHeight, handleSize }) => ({
    padding: handleSize / 2,
    paddingTop: vertical ? 15 : showValue ? 45 : handleSize / 2,
    paddingBottom: vertical ? 15 : showTicks ? 40 : handleSize / 2,
    paddingRight: vertical ? (showValue ? 45 : 30) : handleSize / 2,
    width: vertical ? "auto" : "100%",
    height: vertical ? sliderHeight : "auto",
    flexDirection: vertical ? "row" : "column"
  })
);

const Track = styled(Box)(({ vertical, trackHeight }) => ({
  position: "relative",
  width: vertical ? trackHeight : "100%",
  height: vertical ? "100%" : trackHeight,
  borderRadius: 10
}));

const Progress = animated(
  styled(Box)({
    position: "absolute",
    top: 0,
    left: 0,
    height: 10,
    borderRadius: 10
  })
);

const HandleBox = animated(
  styled.View(({ vertical, trackHeight, handleSize }) => ({
    position: "absolute",
    top: vertical ? -handleSize : trackHeight / 2 + -(handleSize * 2) / 2,
    left: vertical ? trackHeight / 2 + -(handleSize * 2) / 2 : -handleSize,
    width: handleSize * 2,
    height: handleSize * 2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  }))
);

const Handle = styled(Box)(
  ({ vertical, trackHeight, handleSize, handleColor }) => ({
    width: handleSize,
    height: handleSize,
    borderRadius: handleSize / 2,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: handleColor,
    ...(Platform.OS === "web"
      ? {
          cursor: "pointer"
        }
      : {})
  })
);

const Ticks = styled.View(({ vertical, trackHeight, handleSize, size }) => ({
  width: vertical ? 20 : size + handleSize,
  height: vertical ? size + handleSize : 20,
  flexDirection: vertical ? "column" : "row",
  justifyContent: "space-between",
  position: "absolute",
  bottom: vertical ? -handleSize / 2 : -trackHeight - 20,
  right: vertical ? -trackHeight - 20 : -handleSize / 2,
  zIndex: 0,
  web: {
    userSelect: "none"
  }
}));

const Tick = styled.View(({ vertical, handleSize }) => ({
  alignItems: "center",
  justifyContent: "center",
  overflow: "visible",
  width: vertical ? "auto" : handleSize,
  height: vertical ? handleSize : "auto"
}));

const Value = animated(
  styled(Box)(({ vertical }) => ({
    position: "absolute",
    bottom: vertical ? "auto" : 23,
    top: vertical ? -10 : "auto",
    left: vertical ? 25 : -20,
    width: 40,
    height: 20,
    paddingVertical: 4,
    borderRadius: 25,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 500
  }))
);

const Comp = ({
  value = 0,
  onChange,
  onSwipe,
  progressColor = "primary",
  trackColor = "background",
  trackHeight = 10,
  handleSize = 30,
  handleColor = "#FFF",
  min = 0,
  max = 100,
  steps = 1,
  ticks = 10,
  showValue = false,
  valueSuffix,
  showTicks = true,
  vertical = false,
  sliderHeight,
  handleProps = {},
  ...rest
}) => {
  const [position, setPosition] = useState(0);
  const [distance, setDistance] = useState(0);
  const [size, setSize] = useState(0);
  const [swipe, setSwipe] = useState(false);
  const [val, setValue] = useState(value);

  const getTicks = () => {
    const stepArray = [];
    var minStep = min;
    var tickCount = max / ticks;

    if (tickCount * handleSize > size) {
      ticks = ticks * Math.ceil((tickCount * handleSize) / size);
    }

    for (var i = 0; minStep <= max; i++) {
      stepArray.push(minStep);
      minStep = minStep + ticks;
    }

    return stepArray;
  };

  useEffect(() => {
    const progress = invlerp(min, max, value);
    const newPosition = lerp(0, size, progress);
    setValue(value || min);
    setPosition(newPosition);
    setDistance(0);
  }, [value, size]);

  const { slidePosition } = useSpring({
    to: { slidePosition: position + distance },
    immediate: swipe,
    config: { duration: 300 }
  });

  return (
    <SliderWrapper {...rest}>
      <Slider
        showValue={showValue}
        showTicks={showTicks}
        vertical={vertical}
        sliderHeight={sliderHeight}
        handleSize={handleSize}
      >
        <Track
          bg={trackColor}
          trackHeight={trackHeight}
          vertical={vertical}
          onLayout={({ nativeEvent }) => {
            setSize(
              vertical ? nativeEvent.layout.height : nativeEvent.layout.width
            );
          }}
        >
          <Progress
            bg={progressColor}
            style={{
              width: vertical ? "100%" : slidePosition,
              height: vertical ? slidePosition : "100%"
            }}
          />
          <Pan
            as={HandleBox}
            onSwipe={(direction, gestureState) => {
              let { dx, dy } = gestureState;
              let dist = vertical ? dy : dx;
              let newPosition = position + dist;
              let newProgress = invlerp(0, size, newPosition);
              let newValue = Math.round(lerp(min, max, newProgress));
              if (newPosition > size) {
                dist = size - position;
                newValue = max;
              } else if (newPosition < 0) {
                dist = -position;
                newValue = min;
              }
              setValue(newValue);
              setDistance(dist);
              setSwipe(true);
              if (onSwipe) onSwipe(newValue);
            }}
            onSwipeEnd={(direction, gestureState) => {
              let newPosition = position + distance;
              let newProgress = invlerp(0, size, newPosition);
              let newValue = Math.round(lerp(min, max, newProgress));
              if ((newValue / steps) % 1 != 0) {
                newValue = Math.round(newValue / steps) * steps;
                newProgress = invlerp(min, max, newValue);
                newPosition = lerp(0, size, newProgress);
              }
              setPosition(newPosition);
              setValue(newValue);
              setDistance(0);
              setSwipe(false);
              if (onChange) onChange(newValue);
            }}
            vertical={vertical}
            trackHeight={trackHeight}
            handleSize={handleSize}
            style={{
              transform: vertical
                ? [{ translateY: slidePosition }]
                : [{ translateX: slidePosition }]
            }}
          >
            <Handle
              vertical={vertical}
              trackHeight={trackHeight}
              handleSize={handleSize}
              handleColor={handleColor}
              shadow={5}
              {...handleProps}
            />
          </Pan>
          {showValue ? (
            <Value
              bg={"primary"}
              vertical={vertical}
              style={{
                transform: vertical
                  ? [{ translateY: slidePosition }]
                  : [{ translateX: slidePosition }]
              }}
              pointerEvents="none"
            >
              <Text style={{ color: "#FFF", fontSize: 10 }}>
                {val}
                {valueSuffix ? valueSuffix : ""}
              </Text>
            </Value>
          ) : null}
          {showTicks ? (
            <Ticks
              vertical={vertical}
              trackHeight={trackHeight}
              handleSize={handleSize}
              size={size}
              pointerEvents="none"
            >
              {getTicks().map((step, index) => {
                return (
                  <Tick
                    key={`step-${index}`}
                    vertical={vertical}
                    handleSize={handleSize}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 9
                        }}
                        numberOfLines={1}
                      >
                        {step}
                      </Text>
                    </View>
                  </Tick>
                );
              })}
            </Ticks>
          ) : null}
        </Track>
      </Slider>
    </SliderWrapper>
  );
};

export default Comp;
