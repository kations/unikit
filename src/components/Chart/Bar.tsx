import * as React from 'react';
import { Rect, G, Text } from 'react-native-svg';
import { Animated } from 'react-native';

import { useTheme, transformColor } from '../../style';
import { isNumber, getValueByProgress } from '../../util';

const AnimatedBar = Animated.createAnimatedComponent(Rect);

const Delay = ({ children, delay }) => {
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setWaiting(false);
    }, delay);
  }, []);
  if (waiting) return null;
  return children;
};

const Bar = ({ v, height, springConfig = {}, delay = 0, onPress, ...rest }) => {
  const y = React.useMemo(() => new Animated.Value(height), []);

  React.useEffect(() => {
    Animated.spring(y, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <AnimatedBar
      {...rest}
      height={height}
      style={{ transform: [{ translateY: y }] }}
    />
  );
};

export default ({
  pan,
  progress,
  dataKey,
  data,
  scaleY,
  scaleX,
  width,
  height,
  animated = true,
  color = 'primary',
  valueOffset = 0,
  valueColor = 'text',
  activeValueColor = '#FFF',
  onChange,
  showValue = false,
  showActiveValue = false,
  activeIndex,
  activeColor = 'primary',
  barSize,
  formatValue,
  valueFont,
  ...rest
}) => {
  const theme = useTheme();
  const [active, setActive] = React.useState(activeIndex || null);

  React.useEffect(() => {
    if (pan === false && !isNumber(activeIndex)) setActive(null);
    const newActive = Math.floor(getValueByProgress(0, data.length, progress));
    if (isNumber(newActive) && newActive !== active && data[newActive]) {
      setActive(newActive);
      if (onChange)
        onChange({
          value: data[newActive].dataKey,
          item: data[newActive],
          index: newActive,
        });
    }
  }, [progress, pan]);

  return (
    <G
      style={{ overflow: 'hidden' }}
      pointerEvents={onChange ? 'box-none' : 'none'}
    >
      {data.map((v, index) => {
        const isActive = active === index;
        const value = isNumber(v[dataKey]) ? v[dataKey] : v || null;
        if (value === null) return null;

        const defaultW = scaleX.bandwidth
          ? scaleX.bandwidth()
          : width / data.length;
        const w = barSize && barSize < defaultW ? barSize : defaultW;
        const h = Math.abs(scaleY(value) - scaleY(0));

        const y = scaleY(Math.min(value, 0));
        const x = scaleX(index) + defaultW / 2 - w / 2;

        const fill = transformColor({
          value: isActive ? activeColor : color,
          theme,
          themeKey: 'colors',
        });

        const textFill = transformColor({
          value: isActive ? activeValueColor : valueColor,
          theme,
          themeKey: 'colors',
        });

        return (
          <G
            onPress={() => {
              if (onChange) onChange({ value, index });
              setActive(index);
            }}
            key={`bar-${index}`}
          >
            <Delay delay={index * (1000 / data.length)}>
              <Bar
                {...rest}
                v={value}
                x={x}
                y={y - h}
                fill={fill}
                width={w}
                height={h}
                stroke="transparent"
              />
            </Delay>
            {showValue || (isActive && showActiveValue) ? (
              <Text
                x={x + w / 2}
                y={y - h + 15 + valueOffset}
                fontSize={
                  valueFont
                    ? theme.fonts[valueFont]
                      ? theme.fonts[valueFont].fontSize
                      : valueFont
                    : theme.fonts.caption.fontSize
                }
                textAnchor="middle"
                fontFamily={theme.globals.fontFamily}
                fill={textFill}
              >
                {formatValue ? formatValue(value, data[index], index) : value}
              </Text>
            ) : null}
          </G>
        );
      })}
    </G>
  );
};
