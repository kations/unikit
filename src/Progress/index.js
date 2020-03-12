import React, { useState, useEffect } from "react";
import Svg, { Path, G } from "swgs";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { View } from "react-native";

import styled, { useTheme, withThemeProps } from "../styled";
import { getProgress, getValueByProgress } from "../util";

const Wrap = styled.View();
const ValueWrap = styled.View({});
const Label = styled.Text({});

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
      progressWidth,
      progressColor = "primary",
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
          size / 2 -
            (progressWidth >= trackWidth ? progressWidth : trackWidth) / 2,
          0,
          (angle * clampFill(progress)) / 100
        )}
        strokeWidth={progressWidth}
        strokeLinecap={lineCap}
        fill={"transparent"}
        style={{
          stroke: theme.colors[progressColor] || progressColor
        }}
      />
    );
  }
}

const AnimatedPath = animated(PathComp);

const Progress = withThemeProps(
  ({
    value = 0,
    size = 44,
    trackWidth = 8,
    trackColor = "background",
    progressWidth = 6,
    progressColor = "primary",
    loading = false,
    lineCap = "round",
    angle = 360,
    min = 0,
    max = 100,
    showValue,
    formatValue,
    style,
    rotate = 0,
    theme,
    textColor = "text",
    ...rest
  }) => {
    const [running, setRunning] = useState(1); // 0 reset, 1 run
    useEffect(() => {
      if (running === 0) {
        setRunning(1);
      }
    }, [running === 0]);

    const { progress } = useSpring({
      from: { progress: 0 },
      to: { progress: value ? getProgress(0, max, value) * 100 : 0 },
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
      size / 2 - (progressWidth >= trackWidth ? progressWidth : trackWidth) / 2,
      0,
      angle
    );

    return (
      <Wrap relative>
        {showValue && !loading ? (
          <ValueWrap absoluteFill flexCenter>
            <Label color={textColor} fontSize={size / 5}>
              {formatValue ? formatValue(value) : value}
            </Label>
          </ValueWrap>
        ) : null}
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
                      rotate: `${-angle / 2}deg`
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
                theme={theme}
                trackWidth={trackWidth}
                progressWidth={progressWidth}
                progressColor={progressColor}
                lineCap={lineCap}
                size={size}
                angle={angle}
                progress={loading ? 30 : progress}
              />
            </G>
          </Svg>
        </AnimatedView>
      </Wrap>
    );
  },
  "Progress"
);

Progress.propTypes = {
  value: PropTypes.number,
  trackWidth: PropTypes.number,
  progressWidth: PropTypes.number,
  rotate: PropTypes.number,
  angle: PropTypes.number,
  size: PropTypes.number,
  trackColor: PropTypes.string,
  lineCap: PropTypes.string,
  progressColor: PropTypes.string,
  loading: PropTypes.bool,
  style: PropTypes.object,
  showValue: PropTypes.bool,
  formatValue: PropTypes.func,
  textColor: PropTypes.string
};

export default Progress;
