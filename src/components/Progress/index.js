import * as React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { Animated } from 'react-native';
import { svgPathProperties } from 'svg-path-properties';

import Flex from '../Flex';
import Text from '../Text';
import Animate from '../Animate';

import { withThemeProps, useTheme } from '../../restyle';
import { getProgress } from '../../utils';
import { useUpdateEffect, useInterval } from '../../hooks';

const { createAnimatedComponent } = Animated;

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

const AnimatedP = createAnimatedComponent(Path);
const loadingDuration = 750;

const Progress = withThemeProps(
  ({
    value = 0,
    size = 44,
    trackWidth = 6,
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
    animate = true,
    ...rest
  }) => {
    const theme = useTheme();
    const [loadingValue, setLoadingValue] = React.useState(null);
    const animatedValue = React.useMemo(
      () => new Animated.Value(animate ? 0 : value),
      []
    );

    useInterval(
      () => {
        setLoadingValue((v) => (v === 60 ? 10 : 60));
      },
      loading ? loadingDuration / 2 : null
    );

    const startAnimation = () => {
      const type = duration || loading ? 'timing' : 'spring';
      setTimeout(
        () => {
          Animated[type](animatedValue, {
            toValue: getProgress(0, max, loadingValue || value || 0),
            useNativeDriver: true,
            ...(duration ? { duration: duration } : { friction: 6 }),
          }).start();
        },
        duration || loading ? 0 : 500
      );
    };

    useUpdateEffect(() => {
      startAnimation();
    }, [value, loadingValue]);

    React.useEffect(() => {
      startAnimation();
      if (loading) setLoadingValue(60);
    }, []);

    const backgroundPath = circlePath(
      size / 2,
      size / 2,
      size / 2 - (progressWidth >= trackWidth ? progressWidth : trackWidth) / 2,
      0,
      angle
    );

    const strokeDasharray = React.useMemo(
      () => new svgPathProperties(backgroundPath).getTotalLength(),
      [backgroundPath]
    );

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

    const Wrap = loading ? Animate : Flex;
    const wrapProps = loading
      ? {
          loop: true,
          duration: loadingDuration,
          from: { r: 0 },
          to: { r: 360 },
          style: { width: size, height: size },
        }
      : {
          style: {
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
          },
        };

    return (
      <Flex relative style={style}>
        {showValue && !loading ? (
          <Flex absoluteFill flexCenter {...valueProps}>
            <Text color={textColor} fontSize={size / 5} {...labelProps}>
              {formatValue ? formatValue(value) : value}
            </Text>
          </Flex>
        ) : null}
        <Wrap {...wrapProps} inline {...rest}>
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

              <AnimatedP
                strokeWidth={progressWidth}
                style={{ stroke: theme.colors[progressColor] || progressColor }}
                {...pathProps}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={t}
              />
            </G>
          </Svg>
        </Wrap>
      </Flex>
    );
  },
  'Progress'
);

export default Progress;
