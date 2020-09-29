import React, { useMemo, useEffect } from 'react';
import Svg, { Path, G } from 'react-native-svg';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import { svgPathProperties } from 'svg-path-properties';

import styled, { withThemeProps, useTheme } from '../styled';
import { getProgress } from '../util';
import { useUpdateEffect } from '../hooks';

const { concat, createAnimatedComponent } = Animated;

const Wrap = styled.View();
const ValueWrap = styled.View({});
const Label = styled.Text({});

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const circlePath = (x, y, radius, startAngle, endAngle) => {
  var start = polarToCartesian(x, y, radius, endAngle * 0.9999);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  var d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ];
  return d.join(' ');
};

const clampFill = fill => Math.min(100, Math.max(0, fill));

const AnimatedView = createAnimatedComponent(View);
const AnimatedP = createAnimatedComponent(Path);

const Progress = withThemeProps(
  ({
    value = 0,
    size = 44,
    trackWidth = 8,
    trackColor = 'background',
    progressWidth = 6,
    progressColor = 'primary',
    loading = false,
    lineCap = 'round',
    angle = 360,
    duration,
    min = 0,
    max = 100,
    showValue,
    valueProps = {},
    labelProps = {},
    formatValue,
    style,
    rotate = 0,
    textColor = 'text',
    ...rest
  }) => {
    const theme = useTheme();
    const animatedValue = useMemo(() => new Animated.Value(0), []);
    const deg = useMemo(() => new Animated.Value(0), []);

    useUpdateEffect(() => {
      Animated.timing(animatedValue, {
        toValue: getProgress(0, max, value || 0),
        duration: duration,
        useNativeDriver: true,
      }).start();
    }, [value]);

    useEffect(() => {
      if (duration) {
        Animated.timing(animatedValue, {
          toValue: getProgress(0, max, value || 0),
          duration: duration,
          useNativeDriver: true,
        }).start();
      } else {
        setTimeout(() => {
          Animated.spring(animatedValue, {
            toValue: getProgress(0, max, value || 0),
            friction: 6,
            useNativeDriver: true,
          }).start();
        }, 500);
      }

      if (loading) {
        Animated.loop(
          Animated.timing(deg, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        ).start();
      }
    }, []);

    const backgroundPath = circlePath(
      size / 2,
      size / 2,
      size / 2 - (progressWidth >= trackWidth ? progressWidth : trackWidth) / 2,
      0,
      angle
    );

    const strokeDasharray = useMemo(
      () => new svgPathProperties(backgroundPath).getTotalLength(),
      [backgroundPath]
    );

    const loadingRotate = deg.interpolate({
      inputRange: [0, 1],
      outputRange: ['220deg', '580deg'],
    });

    const t = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [strokeDasharray, 0],
    });

    const pathProps = {
      d: backgroundPath,
      strokeLinecap: lineCap,
      strokeDashoffset: 50,
      fill: 'transparent',
    };

    return (
      <Wrap relative style={style}>
        {showValue && !loading ? (
          <ValueWrap absoluteFill flexCenter {...valueProps}>
            <Label color={textColor} fontSize={size / 5} {...labelProps}>
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
                  transform: [{ rotate: loadingRotate }],
                }
              : {
                  width: size,
                  height: size,
                  transform: [
                    {
                      rotate: `${angle !== 360 ? angle / 2 : 0}deg`,
                    },
                    {
                      rotateY: '180deg',
                    },
                  ],
                }
          }
          inline
          {...rest}
        >
          <Svg
            width={size}
            height={size}
            style={{ backgroundColor: 'transparent' }}
          >
            <G rotate={rotate} originX={size / 2} originY={size / 2}>
              <Path
                strokeWidth={trackWidth}
                style={{ stroke: theme.colors[trackColor] || trackColor }}
                {...pathProps}
                {...rest}
              />
              {/* <AnimatedPath
                theme={theme}
                trackWidth={trackWidth}
                progressWidth={progressWidth}
                progressColor={progressColor}
                lineCap={lineCap}
                size={size}
                angle={angle}
                progress={loading ? 30 : animatedValue}
              /> */}
              <AnimatedP
                strokeWidth={progressWidth}
                style={{ stroke: theme.colors[progressColor] || progressColor }}
                {...pathProps}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={loading ? 30 : t}
              />
            </G>
          </Svg>
        </AnimatedView>
      </Wrap>
    );
  },
  'Progress'
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
  textColor: PropTypes.string,
};

export default Progress;

// import React, { useState, useEffect } from "react";
// import Svg, { Path, G } from "react-native-svg";
// import PropTypes from "prop-types";
// import { svgPathProperties } from "svg-path-properties";

// import styled, { useTheme, withThemeProps } from "../styled";
// import { getProgress, getValueByProgress } from "../util";
// import {
//   AnimatedView,
//   useSpring,
//   createAnimatedComponent,
//   Animated,
//   interpolate,
// } from "../Spring";

// const { concat } = Animated;

// const Wrap = styled.View();
// const ValueWrap = styled.View({});
// const Label = styled.Text({});

// const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
//   var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
//   return {
//     x: centerX + radius * Math.cos(angleInRadians),
//     y: centerY + radius * Math.sin(angleInRadians),
//   };
// };

// const circlePath = (x, y, radius, startAngle, endAngle) => {
//   var start = polarToCartesian(x, y, radius, endAngle * 0.9999);
//   var end = polarToCartesian(x, y, radius, startAngle);
//   var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
//   var d = [
//     "M",
//     start.x,
//     start.y,
//     "A",
//     radius,
//     radius,
//     0,
//     largeArcFlag,
//     0,
//     end.x,
//     end.y,
//   ];
//   return d.join(" ");
// };

// const clampFill = (fill) => Math.min(100, Math.max(0, fill));
// const PathAni = createAnimatedComponent(Path);

// const Progress = withThemeProps(
//   ({
//     value = 0,
//     size = 44,
//     trackWidth = 8,
//     trackColor = "background",
//     progressWidth = 6,
//     progressColor = "primary",
//     loading = false,
//     lineCap = "round",
//     angle = 360,
//     min = 0,
//     max = 100,
//     showValue,
//     formatValue,
//     style,
//     rotate = 0,
//     theme,
//     textColor = "text",
//     ...rest
//   }) => {
//     const [running, setRunning] = useState(1); // 0 reset, 1 run
//     useEffect(() => {
//       if (running === 0) {
//         setRunning(1);
//       }
//     }, [running === 0]);

//     //Animated.loop( Animated.timing(this.spinValue, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true, }) ).start()

//     const loadingRotate = useSpring({
//       from: 0,
//       to: 360,
//       config: { duration: 500 },
//       loop: true,
//     });

//     const progressValue = getProgress(0, max, value);

//     const backgroundPath = circlePath(
//       size / 2,
//       size / 2,
//       size / 2 - (progressWidth >= trackWidth ? progressWidth : trackWidth) / 2,
//       0,
//       angle
//     );

//     const progressPathZero = circlePath(
//       size / 2,
//       size / 2,
//       size / 2 - (progressWidth >= trackWidth ? progressWidth : trackWidth) / 2,
//       0,
//       (angle * clampFill(0)) / 100
//     );

//     const progressPath = circlePath(
//       size / 2,
//       size / 2,
//       size / 2 - (progressWidth >= trackWidth ? progressWidth : trackWidth) / 2,
//       0,
//       (angle * clampFill(progressValue)) / 100
//     );

//     const strokeDasharray = new svgPathProperties(
//       backgroundPath
//     ).getTotalLength();

//     const pathAni = useSpring({
//       from: progressPath,
//       to: progressPath,
//     });

//     console.log({ strokeDasharray });

//     return (
//       <Wrap relative>
//         {showValue && !loading ? (
//           <ValueWrap absoluteFill flexCenter>
//             <Label color={textColor} fontSize={size / 5}>
//               {formatValue ? formatValue(value) : value}
//             </Label>
//           </ValueWrap>
//         ) : null}
//         <AnimatedView
//           style={
//             loading
//               ? {
//                   width: size,
//                   height: size,
//                   transform: [{ rotate: concat(loadingRotate, "deg") }],
//                 }
//               : {
//                   width: size,
//                   height: size,
//                   transform: [
//                     {
//                       rotate: `${-angle / 2}deg`,
//                     },
//                   ],
//                 }
//           }
//           inline
//           {...rest}
//         >
//           <Svg
//             width={size}
//             height={size}
//             style={{ backgroundColor: "transparent" }}
//           >
//             <G rotate={rotate} originX={size / 2} originY={size / 2}>
//               <Path
//                 d={backgroundPath}
//                 strokeWidth={trackWidth}
//                 strokeLinecap={lineCap}
//                 fill="transparent"
//                 strokeDashoffset={50}
//                 style={{ stroke: theme.colors[trackColor] || trackColor }}
//                 {...rest}
//               />
//               {/* <AnimatedPath
//                 theme={theme}
//                 trackWidth={trackWidth}
//                 progressWidth={progressWidth}
//                 progressColor={progressColor}
//                 lineCap={lineCap}
//                 size={size}
//                 angle={angle}
//                 progress={loading ? 30 : progress}
//               /> */}
//               <PathAni
//                 d={pathAni}
//                 strokeWidth={progressWidth}
//                 strokeLinecap={lineCap}
//                 fill={"transparent"}
//                 style={{
//                   stroke: theme.colors[progressColor] || progressColor,
//                 }}
//               />
//             </G>
//           </Svg>
//         </AnimatedView>
//       </Wrap>
//     );
//   },
//   "Progress"
// );

// Progress.propTypes = {
//   value: PropTypes.number,
//   trackWidth: PropTypes.number,
//   progressWidth: PropTypes.number,
//   rotate: PropTypes.number,
//   angle: PropTypes.number,
//   size: PropTypes.number,
//   trackColor: PropTypes.string,
//   lineCap: PropTypes.string,
//   progressColor: PropTypes.string,
//   loading: PropTypes.bool,
//   style: PropTypes.object,
//   showValue: PropTypes.bool,
//   formatValue: PropTypes.func,
//   textColor: PropTypes.string,
// };

// export default Progress;
