import React, { useState, useEffect } from "react";
import Svg, { Path, G } from "swgs";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { View } from "react-native";

import styled, { useTheme } from "../styled";

const AnimatedView = animated(View);

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
      circleColor = "primary",
      lineCap,
      size,
      angle,
      theme
    } = this.props;
    return (
      <Path
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
        style={{
          stroke: theme.colors[circleColor] || circleColor
        }}
      />
    );
  }
}

const AnimatedPath = animated(PathComp);

export default function Progress(props) {
  const {
    value = 0,
    size = 44,
    trackWidth = 8,
    trackColor = "background",
    circleWidth = 6,
    circleColor = "primary",
    loading = false,
    lineCap = "round",
    angle = 360,
    style,
    rotate = 0,
    ...rest
  } = props;

  const theme = useTheme();

  const [running, setRunning] = useState(1); // 0 reset, 1 run
  useEffect(() => {
    if (running === 0) {
      setRunning(1);
    }
  }, [running === 0]);

  const { bla } = useSpring({
    from: { bla: 0 },
    to: { bla: value || 0 },
    config: { duration: 300 }
  });

  const { loadingRotate } = useSpring({
    from: { loadingRotate: 0 },
    to: { loadingRotate: 360 },
    reset: running === 0,
    onRest: () => (loading ? setRunning(0) : null),
    config: { duration: 1000 }
  });

  //   const loops = 1;
  //   const { loadingRotate } = useSpring({
  //     from: { loadingRotate: 0 },
  //     to: async next => {
  //       while (1) {
  //         await next({ loadingRotate: loops * 360 });
  //         await next({ loadingRotate: 0 });
  //       }
  //     },
  //     onRest: () => loops++
  //   });

  const backgroundPath = circlePath(
    size / 2,
    size / 2,
    size / 2 - (circleWidth >= trackWidth ? circleWidth : trackWidth) / 2,
    0,
    angle
  );

  return (
    <AnimatedView
      style={
        loading
          ? {
              width: size,
              height: size,
              transform: loadingRotate.interpolate(l => [
                { rotate: `${l + 150}deg` }
              ])
            }
          : {
              width: size,
              height: size,
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
          <Path
            d={backgroundPath}
            strokeWidth={trackWidth}
            strokeLinecap={lineCap}
            fill="transparent"
            strokeDashoffset={50}
            style={{ stroke: theme.colors[trackColor] || trackColor }}
            {...rest}
          />
          <AnimatedPath
            {...props}
            theme={theme}
            trackWidth={trackWidth}
            circleWidth={circleWidth}
            lineCap={lineCap}
            size={size}
            angle={angle}
            progress={loading ? 30 : bla}
          />
        </G>
      </Svg>
    </AnimatedView>
  );
}

Progress.propTypes = {
  value: PropTypes.number,
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
