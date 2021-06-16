import * as React from 'react';
import Svg from 'react-native-svg';
import { scaleLinear, scaleBand } from 'd3-scale';

import Flex from '../Flex';
import { withThemeProps } from '../../style';
import { useLayout, useGesture } from '../../hooks';
import { isNumber, getProgress } from '../../util';

import Line from './Line';
import Bar from './Bar';
import Grid from './Grid';
import GridLine from './GridLine';
import Indicator from './Indicator';
import Axis from '../Axis';
import Pointer from '../Pointer';

const getValue = (d, key) => {
  if (d[key] !== undefined && d[key] !== null && isNumber(d[key])) {
    return d[key];
  } else if (d && isNumber(d)) {
    return d;
  } else {
    return 0;
  }
};

const getDomain = (domain) => [Math.min(...domain), Math.max(...domain)];

const getDomainY = ({ data, keys, yZero }) => {
  const domain = yZero ? [0] : [];

  data.map((d) => {
    keys.map((key) => {
      let value = getValue(d, key);
      if (value !== undefined && isNumber(value)) {
        domain.push(value);
      }
    });
  });
  return getDomain(domain);
};

const Chart = ({
  children,
  data,
  keyProps,
  height,
  contentInset = { bottom: 0, top: 20, left: 0, right: 0 },
  xAxis = false,
  xAxisPadding = 5,
  xTicks,
  useScaleBand = false,
  yAxis = false,
  yAxisPadding = 5,
  yTicks,
  yZero = true,
  legend,
  formatX,
  formatY,
  yDomain,
  minChartWidth,
  wrapperProps = {},
  domainX,
  domainXPadding = 0.1,
  valueOverlay = false,
  gesture = true,
  mouse = true,
  ...rest
}) => {
  const pointerRef = React.useRef(null);
  const { onLayout, width } = useLayout();

  const keys = React.Children.toArray(children).map((c) => {
    if (c && c.props && c.props.dataKey) return c.props.dataKey;
  });

  const scaleY = React.useMemo(
    () =>
      scaleLinear()
        .domain(yDomain || getDomainY({ data, keys, yZero }))
        .range([height - contentInset.bottom, contentInset.top]),
    [data, keys, minChartWidth]
  );

  console.log(pointerRef?.current);
  const scaleX = React.useMemo(() => {
    const width = 300;
    return useScaleBand
      ? scaleBand()
          .domain(
            domainX
              ? [...Array(domainX[1]).keys()]
              : [...Array(data.length).keys()]
          )
          .range([contentInset.left, width - contentInset.right])
          .padding(domainXPadding)
      : scaleLinear()
          .domain(domainX || getDomain(data.map((d, i) => i)))
          .range([contentInset.left, width - contentInset.right]);
  }, [data, keys, pointerRef, minChartWidth]);

  const offset = scaleX.bandwidth ? scaleX.bandwidth() : 0;

  return (
    <Flex width="100%" row {...rest}>
      {yAxis && (
        <Axis
          orient="LEFT"
          scale={scaleY}
          height={height}
          padding={yAxisPadding}
          ticks={yTicks}
          formatTick={(v) => {
            if (formatY) {
              return formatY(v);
            }
            return v;
          }}
        />
      )}
      <Flex flex={1}>
        <Pointer
          ref={pointerRef}
          w="100%"
          h={height}
          collapsable={false}
          relative
          {...wrapperProps}
        >
          {({ x, xProgress, y, width, height, pointer }) => (
            <Svg
              style={{
                width: '100%',
                height: height,
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                borderRadius: wrapperProps.borderRadius,
              }}
            >
              {React.Children.toArray(children).map((c, i) => {
                if (c) {
                  return React.cloneElement(c, {
                    ...c.props,
                    data,
                    width,
                    height,
                    scaleY,
                    scaleX,
                    domainX,
                    contentInset,
                    keys,
                    progress: xProgress,
                    pan: pointer,
                    offset,
                    gesture,
                  });
                }
              })}
            </Svg>
          )}
        </Pointer>
        {xAxis && (
          <Axis
            scale={scaleX}
            useScaleBand={useScaleBand}
            height={height}
            width={width}
            padding={xAxisPadding}
            ticks={xTicks || data.length}
            formatTick={(d) => {
              if (typeof data[d] === 'undefined') return '';
              if (formatX) {
                return formatX(data[d], d);
              }
              return data[d].label || d;
            }}
          />
        )}
      </Flex>
    </Flex>
  );

  return (
    <Flex width="100%" row {...rest}>
      {yAxis && (
        <Axis
          orient="LEFT"
          scale={scaleY}
          height={height}
          padding={yAxisPadding}
          ticks={yTicks}
          formatTick={(v) => {
            if (formatY) {
              return formatY(v);
            }
            return v;
          }}
        />
      )}
      <Flex flex={1}>
        <Flex
          width="100%"
          onLayout={onLayout}
          height={height}
          position="relative"
          collapsable={false}
          onMouseOver={
            mouse
              ? (e) => {
                  setPan(true);
                }
              : undefined
          }
          onMouseMove={
            mouse
              ? (e) => {
                  const { layerX } = e.nativeEvent;
                  setProgressValue({ dist: layerX });
                }
              : undefined
          }
          onMouseLeave={
            mouse
              ? () => {
                  setPan(false);
                }
              : undefined
          }
          {...(gesture ? bindGesture : {})}
          {...wrapperProps}
        >
          {width > 0 && (
            <Svg
              style={{
                width: '100%',
                height: height,
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                borderRadius: wrapperProps.borderRadius,
              }}
            >
              {React.Children.toArray(children).map((c, i) => {
                if (c) {
                  return React.cloneElement(c, {
                    ...c.props,
                    data,
                    width,
                    height,
                    scaleY,
                    scaleX,
                    domainX,
                    contentInset,
                    keys,
                    progress,
                    pan,
                    offset,
                    gesture,
                  });
                }
              })}
            </Svg>
          )}
        </Flex>
        {xAxis && (
          <Axis
            scale={scaleX}
            useScaleBand={useScaleBand}
            height={height}
            width={width}
            padding={xAxisPadding}
            ticks={xTicks || data.length}
            formatTick={(d) => {
              if (typeof data[d] === 'undefined') return '';
              if (formatX) {
                return formatX(data[d], d);
              }
              return data[d].label || d;
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};

const ChartWithTheme = withThemeProps(Chart, 'Chart');

ChartWithTheme.Line = Line;
ChartWithTheme.Bar = Bar;
ChartWithTheme.Grid = Grid;
ChartWithTheme.Indicator = Indicator;
ChartWithTheme.GridLine = GridLine;

export default ChartWithTheme;
