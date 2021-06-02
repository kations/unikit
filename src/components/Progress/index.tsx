import * as React from 'react';
import Svg, { Path, G } from 'react-native-svg';

import Flex from '../Flex';
import Text from '../Text';
import Animate from '../Animate';
import AnimatedPath from '../AnimatedPath';

import { withThemeProps } from '../../style';
import { getProgress } from '../../util';
import { useInterval } from '../../hooks';

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

interface Props {
  theme: object;
  value?: number;
  size?: number;
  trackWidth?: number;
  trackColor?: string;
  progressWidth?: number;
  progressColor?: string;
  loading?: boolean;
  lineCap?: string;
  angle?: number;
  duration?: number;
  showValue?: boolean;
  formatValue?: () => void;
  valueProps?: object;
  labelProps?: object;
  textColor?: string;
  animate?: boolean;
  animationType?: string;
  [key: string]: any;
}

const Progress = ({
  theme,
  value = 0,
  size = 44,
  trackWidth = 6,
  trackColor = 'background',
  progressWidth = 6,
  progressColor = 'primary',
  loading = false,
  lineCap = 'round',
  angle = 360,
  duration = 750,
  min = 0,
  max = 100,
  showValue = false,
  valueProps = {},
  labelProps = {},
  formatValue,
  textColor = 'text',
  animate = true,
  animationType = 'spring',
  ...rest
}: Props) => {
  const [progress, setProgress] = React.useState(
    loading ? 0.3 : getProgress(0, max, value || 0)
  );

  React.useEffect(() => {
    if (value) {
      setProgress(loading ? 0.3 : getProgress(0, max, value || 0));
    }
  }, [value]);

  useInterval(
    () => {
      setProgress((p) => (p === 0.3 ? 0 : 0.3));
    },
    loading ? 1000 : null
  );

  const backgroundPath = React.useMemo(
    () =>
      circlePath(
        size / 2,
        size / 2,
        size / 2 -
          (progressWidth >= trackWidth ? progressWidth : trackWidth) / 2,
        0,
        angle
      ),
    [progressWidth, trackWidth, angle]
  );

  const pathProps = {
    d: backgroundPath,
    strokeLinecap: lineCap,
    fill: 'transparent',
    duration,
  };

  const Wrap = loading ? Animate : Flex;
  const wrapProps = loading
    ? {
        repeat: -1,
        duration,
        from: { rotate: '0deg' },
        to: { rotate: '360deg' },
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
    <Flex relative {...rest}>
      {showValue && !loading ? (
        <Flex absoluteFill flexCenter {...valueProps}>
          <Text color={textColor} fontSize={size / 5} {...labelProps}>
            {formatValue ? formatValue(value) : value}
          </Text>
        </Flex>
      ) : null}
      <Wrap {...wrapProps} inline>
        <Svg
          width={size}
          height={size}
          style={{ backgroundColor: 'transparent' }}
        >
          <G originX={size / 2} originY={size / 2}>
            <Path
              strokeWidth={trackWidth}
              style={{ stroke: theme.colors[trackColor] || trackColor }}
              {...pathProps}
              {...rest}
            />

            <AnimatedPath
              strokeWidth={progressWidth}
              progress={progress}
              animationType={animationType}
              style={{ stroke: theme.colors[progressColor] || progressColor }}
              {...pathProps}
            />
          </G>
        </Svg>
      </Wrap>
    </Flex>
  );
};

export default withThemeProps(Progress, 'Progress');
