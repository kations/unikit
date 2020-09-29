import * as React from 'react';
import { svgPathProperties } from 'svg-path-properties';
import { G, Circle, Text, Rect } from 'react-native-svg';
import { Animated } from 'react-native';

import { useTheme } from '../../restyle';
import { isDark } from '../../utils';

const ValuePoint = Animated.createAnimatedComponent(Circle);

function getPathCoordinates({ d, width, progress }) {
  const properties = new svgPathProperties(d);
  const pathLength = properties.getTotalLength();
  const _x = progress * width;
  var beginning = _x,
    end = pathLength,
    target,
    pos;
  target = Math.floor((beginning + end) / 2);

  while (true) {
    target = Math.floor((beginning + end) / 2);
    pos = properties.getPointAtLength(target);

    if ((target === end || target === beginning) && pos.x !== _x) {
      break;
    }
    if (pos.x > _x) {
      end = target;
    } else if (pos.x < _x) {
      beginning = target;
    } else {
      break; //position found
    }
  }
  return pos;
}

const ValueDot = ({
  d,
  scaleY,
  showValue,
  width,
  strokeWidth,
  dotSize = 5,
  progress,
  color,
}) => {
  const opacity = React.useMemo(() => new Animated.Value(0), []);

  const theme = useTheme();
  const pos = React.useMemo(
    () =>
      getPathCoordinates({
        d,
        width,
        progress,
      }),
    [d, progress, width]
  );

  React.useEffect(() => {
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const value = `${scaleY.invert(pos.y).toFixed(2)}`;
  const valueWidth = value.length * 5 + 16;

  return (
    <G x={pos.x} y={pos.y} style={{ opacity }}>
      <ValuePoint
        w={dotSize}
        h={dotSize}
        r={dotSize}
        strokeWidth={strokeWidth}
        stroke={color}
        fill={theme.colors.surface}
      />
      {showValue && (
        <>
          <Rect
            width={valueWidth}
            x={-valueWidth / 2}
            y={-28}
            height={20}
            fill={color}
            align="center"
            rx={10}
            ry={10}
          />
          <Text
            fontSize={theme.fonts.caption.fontSize}
            textAnchor="middle"
            fontFamily={theme.globals.fontFamily}
            y={-15}
            fill={isDark(color) ? '#FFF' : '#000'}
          >
            {value}
          </Text>
        </>
      )}
    </G>
  );
};

export default ValueDot;
