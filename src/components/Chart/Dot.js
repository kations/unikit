import * as React from 'react';
import { svgPathProperties } from 'svg-path-properties';
import { G, Circle, Text, Rect } from 'react-native-svg';
import { Animated } from 'react-native';

import { useTheme } from '../../restyle';
import { isDark, getValueByProgress } from '../../utils';

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
  data,
  d,
  scaleY,
  showDot = true,
  showValue,
  valueFontSize,
  valueFont = 'caption',
  width,
  strokeWidth,
  dotSize = 5,
  progress,
  color,
  onChange,
  formatValue,
  value,
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

  const fontSize = valueFontSize || theme.fonts[valueFont].fontSize;
  const val = value || `${scaleY.invert(pos.y).toFixed(2)}`;
  const valueWidth = val.toString().length * 3 + fontSize * 3;

  React.useEffect(() => {
    if (onChange) {
      const newActive = Math.floor(
        getValueByProgress(0, data.length, progress)
      );
      onChange({
        value: formatValue ? formatValue(val) : val,
        item: data[newActive],
        index: newActive,
      });
    }
  }, [val]);

  return (
    <G x={pos.x} y={pos.y} style={{ opacity }}>
      {showDot && (
        <ValuePoint
          w={dotSize}
          h={dotSize}
          r={dotSize}
          strokeWidth={strokeWidth}
          stroke={color}
          fill={theme.colors.surface}
        />
      )}
      {showValue && (
        <>
          <Rect
            width={valueWidth}
            x={-valueWidth / 2}
            y={-(fontSize * 3)}
            height={fontSize * 2}
            fill={color}
            align="center"
            rx={fontSize}
            ry={fontSize}
          />
          <Text
            fontSize={fontSize}
            textAnchor="middle"
            fontFamily={theme.globals.fontFamily}
            y={-((fontSize * 3) / 2) - 1}
            fill={isDark(color) ? '#FFF' : '#000'}
          >
            {formatValue ? formatValue(val) : val}
          </Text>
        </>
      )}
    </G>
  );
};

export default ValueDot;
