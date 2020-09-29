import * as React from "react";
import { Platform } from "react-native";
import Flex from "../Flex";
import Text from "../Text";

export const isWeb = Platform.OS === "web";

var top = 1,
  right = 2,
  bottom = 3,
  left = 4;

function identity(x) {
  return x;
}

function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

function number(scale) {
  return function (d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) offset = Math.round(offset);
  return function (d) {
    return +scale(d) + offset;
  };
}

function Tick(props) {
  const {
      value,
      x,
      k,
      tickSizeInner,
      spacing,
      orient,
      transform,
      position,
      format,
      gridSize,
      gridColor,
      labelFont,
      labelColor,
    } = props,
    dy = orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em",
    line_props = {},
    text_props = { dy: dy };
  line_props[x + "2"] = k * tickSizeInner;
  text_props[x] = k * spacing;

  let textAlign =
    orient === right ? "left" : orient === left ? "right" : "center";

  if (orient === left) {
    return (
      <Flex
        absolute
        l={0}
        t={position(value) - 4}
        r={gridSize}
        row
        justifyContent="flex-end"
        alignItems={"center"}
        zIndex={0}
      >
        <Flex>
          <Text
            color={labelColor}
            font={labelFont}
            numberOfLiness={1}
            textAlign={textAlign}
            {...text_props}
          >
            {format(value)}
          </Text>
        </Flex>
        <Flex bg={gridColor} w={5} h={gridSize} ml={3} />
      </Flex>
    );
  }
  return (
    <Flex w={0.5} alignItems="center" zIndex={0} relative>
      <Flex bg={gridColor} w={gridSize} h={5} />
      <Flex w={100}>
        <Text
          color={labelColor}
          font={labelFont}
          textAlign={textAlign}
          {...text_props}
        >
          {format(value)}
        </Text>
      </Flex>
    </Flex>
  );
}

function Axis(props) {
  const {
    axisProps = {},
    scale,
    orient,
    ticks,
    tickValues,
    tickFormat,
    axisColor,
    height,
    gridSize,
    gridColor,
    labelFont = "label",
    labelColor = "text",
  } = props;

  var transform = orient === top || orient === bottom ? translateX : translateY,
    values =
      tickValues == null
        ? scale.ticks
          ? scale.ticks.apply(scale, ticks)
          : scale.domain()
        : tickValues,
    format =
      tickFormat == null
        ? scale.tickFormat
          ? scale.tickFormat.apply(scale, ticks)
          : identity
        : tickFormat,
    position = (scale.bandwidth ? center : number)(scale.copy());

  if (orient === left) {
    const max = tickFormat
      ? tickFormat(Math.max(...values))
      : Math.max(...values);
    return (
      <Flex
        h={height}
        width={max.toString().length * 10}
        mr={-gridSize}
        pointerEvents="none"
        relative
        {...axisProps}
      >
        {values.map((value, index) => {
          return (
            <Tick
              key={"tick-" + index}
              first={index === 0}
              last={index === values.length - 1}
              value={value}
              orient={orient}
              transform={transform}
              position={position}
              format={format}
              gridSize={gridSize}
              gridColor={axisColor || gridColor}
              labelFont={labelFont}
              labelColor={labelColor}
            />
          );
        })}

        <Flex
          h={height}
          w={gridSize}
          bg={axisColor || gridColor}
          absolute
          t={0}
          r={0}
        />
      </Flex>
    );
  }

  return (
    <Flex w="100%" pointerEvents="none">
      <Flex w="100%" h={gridSize} bg={axisColor || gridColor} />
      <Flex w="100%" justifyContent="space-between" row {...axisProps}>
        {values.map((value, index) => {
          return (
            <Tick
              key={"tick-" + index}
              value={value}
              orient={orient}
              transform={transform}
              position={position}
              format={format}
              gridSize={gridSize}
              labelFont={labelFont}
              labelColor={labelColor}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}

Axis.defaultProps = {
  tickArguments: [],
  tickValues: null,
  tickFormat: null,
  tickSizeInner: 6,
  tickSizeOuter: 6,
  tickPadding: 3,
  transform: "translate(0, 0)",
  gridSize: 0.75,
};

function AxisTop(props) {
  return <Axis orient={top} {...props} />;
}

function AxisRight(props) {
  return <Axis orient={right} {...props} />;
}

function AxisBottom(props) {
  return <Axis orient={bottom} {...props} />;
}

function AxisLeft(props) {
  return <Axis orient={left} {...props} />;
}

export { AxisTop, AxisRight, AxisBottom, AxisLeft };
