import React, { useState, useEffect } from "react";
import { View, Text, Platform } from "react-native";
import { useSpring, animated } from "react-spring/native";

import Pan from "../helper/Pan";
import styled from "../../style/styled";
import { invlerp, lerp } from "../../helper";

const Slider = styled.View(
  ({ showValue, showTicks, vertical, sliderHeight, handleSize }) => ({
    padding: handleSize / 2,
    paddingTop: vertical ? 15 : showValue ? 45 : handleSize / 2,
    paddingBottom: vertical ? 15 : showTicks ? 40 : handleSize / 2,
    paddingRight: vertical ? (showValue ? 45 : 30) : handleSize / 2,
    width: vertical ? "auto" : "100%",
    height: vertical ? sliderHeight : "auto%",
    flexDirection: vertical ? "row" : "column"
  })
);

const Track = styled.View(({ vertical, trackHeight }) => ({
  position: "relative",
  width: vertical ? trackHeight : "100%",
  height: vertical ? "100%" : trackHeight,
  borderRadius: 10
}));

const Progress = animated(
  styled.View({
    position: "absolute",
    top: 0,
    left: 0,
    height: 10,
    borderRadius: 10
  })
);

const Handle = animated(
  styled.View(({ vertical, trackHeight, handleSize }) => ({
    position: "absolute",
    top: vertical ? -handleSize / 2 : -trackHeight,
    left: vertical ? -trackHeight : -handleSize / 2,
    width: handleSize,
    height: handleSize,
    borderRadius: handleSize / 2,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    ...(Platform.OS === "web"
      ? {
          cursor: "pointer"
        }
      : {})
  }))
);

const Ticks = styled.View(({ vertical, trackHeight, handleSize, size }) => ({
  width: vertical ? 20 : size + handleSize,
  height: vertical ? size + handleSize : 20,
  flexDirection: vertical ? "column" : "row",
  justifyContent: "space-between",
  position: "absolute",
  bottom: vertical ? -handleSize / 2 : -trackHeight - 20,
  right: vertical ? -trackHeight - 20 : -handleSize / 2,
  zIndex: 0
}));

const Tick = styled.View(({ vertical, handleSize }) => ({
  alignItems: "center",
  justifyContent: "center",
  overflow: "visible",
  width: vertical ? "auto" : handleSize,
  height: vertical ? handleSize : "auto"
}));

const Value = animated(
  styled.View(({ vertical }) => ({
    position: "absolute",
    bottom: vertical ? "auto" : 23,
    top: vertical ? -10 : "auto",
    left: vertical ? 25 : -15,
    width: 30,
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
  showValue = true,
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
    <Slider
      showValue={showValue}
      showTicks={showTicks}
      vertical={vertical}
      sliderHeight={sliderHeight}
      handleSize={handleSize}
      {...rest}
    >
      <Track
        trackHeight={trackHeight}
        vertical={vertical}
        style={{ backgroundColor: trackColor }}
        onLayout={({ nativeEvent }) => {
          setSize(
            vertical ? nativeEvent.layout.height : nativeEvent.layout.width
          );
        }}
      >
        <Progress
          style={{
            width: vertical ? "100%" : slidePosition,
            height: vertical ? slidePosition : "100%",
            backgroundColor: progressColor
          }}
        />
        <Pan
          as={Handle}
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
          {...handleProps}
          style={{
            ...(handleProps.style ? handleProps.style : {}),
            transform: vertical
              ? [{ translateY: slidePosition }]
              : [{ translateX: slidePosition }],
            backgroundColor: handleColor
          }}
        />
        {showValue ? (
          <Value
            vertical={vertical}
            style={{
              transform: vertical
                ? [{ translateY: slidePosition }]
                : [{ translateX: slidePosition }],
              backgroundColor: "primary"
            }}
            pointerEvents="none"
          >
            <Text style={{ color: "#FFF", fontSize: 10 }}>{val}</Text>
          </Value>
        ) : null}
        {showTicks ? (
          <Ticks
            vertical={vertical}
            trackHeight={trackHeight}
            handleSize={handleSize}
            size={size}
          >
            {getTicks().map(step => {
              return (
                <Tick vertical={vertical} handleSize={handleSize}>
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
  );
};

export default Comp;
