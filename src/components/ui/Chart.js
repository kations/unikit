import React, { useState, useEffect } from "react";
import { useSprings, animated, useTransition } from "react-spring/native";
import { TouchableOpacity, Text, Dimensions } from "react-native";
import PropTypes from "prop-types";

import Box from "../primitives/Box";
import Flex from "../primitives/Flex";

function invlerp(a, b, v) {
  return (v - a) / (b - a);
}

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

const Bar = animated(Box);

const Comp = props => {
  const {
    data,
    onPress,
    height,
    width,
    barWidth,
    gap,
    barColor,
    selected,
    selectedBarColor,
    grid,
    gridLines,
    ...rest
  } = props;

  if (data.length === 0) return null;

  const Screen = Dimensions.get("window");
  const [calcedBarWidth, setWidth] = useState(
    barWidth !== "auto" ? barWidth : Screen.width / data.length
  );

  if (data[0] === "number") {
    var max = Math.max.apply(null, data);
    var min = Math.abs(Math.min.apply(null, data));
  } else {
    var max = Math.max.apply(null, data.map(a => a.value));
    var min = Math.abs(Math.min.apply(null, data.map(a => a.value)));
  }

  const factor = height / (max + min);

  console.log({ data, max, min, factor });
  const getHeight = number => {
    const height = number * factor;
    console.log({ height, number, factor });
    return height;
  };

  if (data[0] === "number") {
    var transitionData = data.map((item, index) => {
      return { value: item, label: `bar-${index}` };
    });
  } else {
    var transitionData = data;
  }

  console.log({ transitionData });

  const transitions = useTransition(transitionData, data => data.label, {
    from: { height: 0, opacity: 0 },
    leave: { height: 0, opacity: 0 },
    enter: item => ({ height: getHeight(item.value), opacity: 1 }),
    update: item => ({ height: getHeight(item.value) })
  });

  //const springs = useSprings(data.length, data.map(item => ({ height: getHeight(item) }))

  return (
    <Box
      style={{
        width: width || "100%",
        height: "auto"
      }}
      onLayout={({ nativeEvent }) => {
        const width = nativeEvent.layout.width / data.length;
        setWidth(width - gap * 2);
      }}
    >
      <Flex
        style={{
          width: "100%",
          height: height,
          flexDirection: "row",
          alignItems: "flex-end"
        }}
      >
        {grid ? (
          <Box
            position="absolute"
            left="0"
            bottom={min * factor - 1}
            width="100%"
            height={2}
            backgroundColor="background"
          />
        ) : null}
        {transitions.map(({ item, props: { height }, key }, index) => (
          <Bar
            as={onPress ? TouchableOpacity : undefined}
            key={key}
            backgroundColor={
              selected && selected === index ? selectedBarColor : barColor
            }
            style={{
              width: calcedBarWidth,
              marginHorizontal: gap,
              height: height.interpolate(h => Math.abs(h)),
              marginBottom: height.interpolate(h =>
                h < 0 ? min * factor + h : min * factor
              )
            }}
          />
        ))}
      </Flex>
      <Flex
        style={{
          width: "100%",
          flexDirection: "row",
          paddingVertical: 10
        }}
      >
        {transitionData.map((item, index) => (
          <Flex
            style={{
              width: calcedBarWidth,
              marginHorizontal: gap,
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 10 }}>{item.label}</Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  circleSize: PropTypes.number,
  borderSize: PropTypes.number,
  onChange: PropTypes.func
};

Comp.defaultProps = {
  data: [],
  height: 300,
  barWidth: "auto",
  gap: 5,
  barColor: "background",
  selectedBarColor: "primary",
  grid: true,
  gridLines: 10
};

export default Comp;
