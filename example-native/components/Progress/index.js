import React, { useState } from "react";
import Svg, { Path, Circle, G } from "swgs";
import { View, Text } from "react-native";
import { useSpring, animated } from "react-spring";

const AnimatedView = animated(View);

import PropTypes from "prop-types";

import { getProp, getColorSchema } from "../../helper";

// import styles from "./styles.css";

const radius = 175;
const diameter = Math.round(Math.PI * radius * 2);

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

const circlePath = (x, y, radius, startAngle, endAngle) => {
  var start = polarToCartesian(x, y, radius, endAngle * 0.9999);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y
  ];
  return d.join(" ");
};

const clampFill = fill => Math.min(100, Math.max(0, fill));

const Comp = ({
  progress,
  size,
  lineWidth,
  loading,
  lineCap,
  responsive,
  onAnimationEnd,
  arcSweepAngle,
  style,
  tintColor,
  backgroundColor
}) => {
  const backgroundPath = circlePath(
    size / 2,
    size / 2,
    size / 2 - lineWidth / 2,
    0,
    arcSweepAngle
  );

  const { rotate, opacity } = useSpring({
    from: { opacity: 0, rotate: 0 },
    to: async next => {
      while (true) {
        await next({ opacity: 1, rotate: 360 });
        await next({ opacity: 0, rotate: 0 });
      }
    }
  });

  const circlePathIndicator = circlePath(
    size / 2,
    size / 2,
    size / 2 - lineWidth / 2,
    0,
    (arcSweepAngle * clampFill(progress)) / 100
  );
  //transform: rotate.interpolate(r => `rotate(${r}deg)`),
  return (
    <AnimatedView
      style={{
        width: size,
        height: size,
        //transform: rotate.interpolate(r => `rotate(${r}deg)`),
        opacity: opacity
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ backgroundColor: "transparent" }}
      >
        <G rotation={90} originX={size / 2} originY={size / 2}>
          {backgroundColor && (
            <Path
              d={backgroundPath}
              stroke={backgroundColor}
              strokeWidth={lineWidth}
              strokeLinecap={lineCap}
              fill="transparent"
            />
          )}
          <Path
            d={circlePathIndicator}
            stroke={tintColor}
            strokeWidth={lineWidth}
            strokeLinecap={lineCap}
            fill={"transparent"}
          />
        </G>
      </Svg>
    </AnimatedView>
  );
};

Comp.defaultProps = {
  tintColor: "#000",
  backgroundColor: "#CCC",
  animate: true,
  animationDuration: "1s",
  loadingDuration: "3s",
  showPercentage: true,
  showPercentageSymbol: true,
  size: 100,
  lineWidth: 30,
  percentSpacing: 10,
  roundedStroke: true,
  progress: 10,
  arcSweepAngle: 360,
  rotation: 90,
  loading: true,
  lineCap: "butt" //"round" : "butt"
};

Comp.propTypes = {
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object
};

export default Comp;
