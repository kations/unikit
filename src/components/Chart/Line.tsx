import * as React from 'react';
import { Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import * as shape from 'd3-shape';

import AnimatedPath from '../AnimatedPath';
import { useTheme, transformColor } from '../../style';
import { isNumber } from '../../util';
import Dot from './Dot';

export default ({
  progress,
  pan,
  gesture,
  data,
  dataKey,
  scaleX,
  scaleY,
  width,
  height,
  showValue = false,
  valueFont,
  valueFontSize,
  showDot = true,
  showDots = false,
  animated = true,
  color = 'primary',
  fill,
  gradient = true,
  gradientColor,
  strokeWidth = 1,
  shadow = 4,
  shadowOpacity = 0.2,
  strokeDasharray,
  curve = 'curveNatural', // "curveLinear"
  gradientOpacity = 1,
  gradientStartColor,
  gradientStopColor,
  offset,
  onChange,
  formatValue,
}) => {
  const theme = useTheme();
  const stroke = transformColor({ value: color, theme, themeKey: 'colors' });
  const gColor = transformColor({
    value: gradientColor || stroke,
    theme,
    themeKey: 'colors',
  });
  const fillColor = fill
    ? transformColor({
        value: full,
        theme,
        themeKey: 'colors',
      })
    : undefined;
  const PathComp = animated ? AnimatedPath : Path;

  const d = React.useMemo(
    () =>
      shape
        .line()
        .x(
          (p, i) => scaleX(i) + (scaleX.bandwidth ? scaleX.bandwidth() / 2 : 0)
        )
        .y((p) => {
          return scaleY(isNumber(p[dataKey]) ? p[dataKey] : p || 0);
        })
        .curve(shape[curve])(data),
    [data]
  );

  return (
    <G pointerEvents="none">
      {gradient || fill ? (
        <>
          <Defs key={stroke}>
            <LinearGradient
              id={`gradient-${color}`}
              x1={'0%'}
              y1={'0%'}
              x2={'0%'}
              y2={fill || gradientStartColor ? '100%' : '80%'}
            >
              <Stop
                offset={'0%'}
                stopColor={gradientStartColor || fillColor || gColor}
                stopOpacity={fill || gradientStartColor ? gradientOpacity : 0.2}
              />
              <Stop
                offset={'100%'}
                stopColor={gradientStopColor || fillColor || gColor}
                stopOpacity={fill || gradientStopColor ? gradientOpacity : 0}
              />
            </LinearGradient>
          </Defs>
          <Path
            d={`${d}L ${width} ${height} L 0 ${height}`}
            fill={`url(#${`gradient-${color}`})`}
          />
        </>
      ) : null}
      {shadow && shadow > 0 ? (
        <PathComp
          y={strokeWidth > 1 ? strokeWidth : 2}
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          d={d}
          strokeWidth={shadow}
          fill={'transparent'}
          style={{ opacity: shadowOpacity }}
        />
      ) : null}
      <PathComp
        fill="transparent"
        stroke={stroke}
        {...{ d, strokeWidth, strokeDasharray }}
      />
      {pan && gesture && (
        <Dot
          data={data}
          dataKey={dataKey}
          d={d}
          width={width - offset}
          strokeWidth={strokeWidth}
          progress={progress}
          color={stroke}
          scaleY={scaleY}
          showValue={showValue}
          showDot={showDot}
          onChange={onChange}
          formatValue={formatValue}
          valueFont={valueFont}
          valueFontSize={valueFontSize}
        />
      )}

      {showDots &&
        data.map((item, i) => {
          return (
            <Dot
              key={`dot-${i}`}
              data={data}
              dataKey={dataKey}
              value={item[dataKey]}
              d={d}
              width={width - offset}
              strokeWidth={strokeWidth}
              progress={(1 / (data.length - 1)) * i}
              color={stroke}
              scaleY={scaleY}
              showValue={showValue}
              showDot
              onChange={onChange}
              formatValue={formatValue}
              valueFont={valueFont}
              valueFontSize={valueFontSize}
            />
          );
        })}
    </G>
  );
};
