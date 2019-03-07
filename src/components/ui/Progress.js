import React, { useState, useEffect } from "react";
import Svg, { Path, G } from "swgs";
import { Animated, Easing } from "react-native";
import { useSpring, animated } from "react-spring";
import styled, { withTheme } from "styled-components";
import PropTypes from "prop-types";

import { getProp, getColorSchema } from "../../helper";
import Block from "../primitives/Block";

const Track = styled(Path)`
  stroke: ${p => getProp(p, "trackColor", "progress")};
`;

const Circle = styled(Path)`
  stroke: ${p => getProp(p, "circleColor", "progress")};
`;

const AnimatedView = animated(Block);

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

class PathComp extends React.PureComponent {
  render() {
    const {
      progress,
      trackWidth,
      circleWidth,
      lineCap,
      size,
      angle,
      rotate,
      ...rest
    } = this.props;
    return (
      <Circle
        d={circlePath(
          size / 2,
          size / 2,
          size / 2 - (circleWidth >= trackWidth ? circleWidth : trackWidth) / 2,
          0,
          (angle * clampFill(progress)) / 100
        )}
        strokeWidth={circleWidth}
        strokeLinecap={lineCap}
        fill={"transparent"}
        {...rest}
      />
    );
  }
}

const AnimatedPath = animated(PathComp);

const Comp = props => {
  const {
    progress,
    size,
    trackWidth,
    circleWidth,
    loading,
    lineCap,
    angle,
    style,
    rotate,
    ...rest
  } = props;

  const [running, setRunning] = useState(1); // 0 reset, 1 run
  useEffect(() => {
    if (running === 0) {
      setRunning(1);
    }
  }, [running === 0]);

  const { bla } = useSpring({
    from: { bla: 0 },
    to: { bla: progress || 0 },
    config: { duration: 300 }
  });

  const { loadingRotate } = useSpring({
    from: { loadingRotate: 0 },
    to: { loadingRotate: 360 },
    reset: running === 0,
    onRest: () => (loading ? setRunning(0) : null),
    config: { duration: 1000 }
  });

  const backgroundPath = circlePath(
    size / 2,
    size / 2,
    size / 2 - (circleWidth >= trackWidth ? circleWidth : trackWidth) / 2,
    0,
    angle
  );

  return (
    <AnimatedView
      width={size}
      height={size}
      style={
        loading
          ? {
              transform: loadingRotate.interpolate(l => `rotate(${l}deg)`)
            }
          : {
              transform: [
                {
                  rotate: `${rotate}deg`
                }
              ]
            }
      }
      inline
      {...rest}
    >
      <Svg
        width={size}
        height={size}
        style={{ backgroundColor: "transparent" }}
      >
        <G rotate={rotate} originX={size / 2} originY={size / 2}>
          <Track
            d={backgroundPath}
            strokeWidth={trackWidth}
            strokeLinecap={lineCap}
            fill="transparent"
            strokeDashoffset={50}
            {...rest}
          />
          <AnimatedPath
            {...props}
            progress={
              loading
                ? loadingRotate.interpolate([0, 180, 360], [75, 25, 75])
                : bla
            }
          />
        </G>
      </Svg>
    </AnimatedView>
  );
};

Comp.defaultProps = {
  showPercentage: true,
  showPercentageSymbol: true,
  size: 100,
  trackWidth: 30,
  circleWidth: 30,
  angle: 360,
  rotate: 0,
  loading: false,
  lineCap: "round" //"round" : "butt"
};

Comp.propTypes = {
  progress: PropTypes.number,
  trackWidth: PropTypes.number,
  circleWidth: PropTypes.number,
  rotate: PropTypes.number,
  angle: PropTypes.number,
  size: PropTypes.number,
  trackColor: PropTypes.string,
  lineCap: PropTypes.string,
  circleColor: PropTypes.string,
  loading: PropTypes.bool,
  style: PropTypes.object
};

export default Comp;
