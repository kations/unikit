import * as React from 'react';

import Flex from '../Flex';
import Text from '../Text';

function translateX(scale0, scale1, d) {
  const x = scale0(d);
  return isFinite(x) ? x : scale1(d);
}

function translateY(scale0, scale1, d) {
  const y = scale0(d);
  return isFinite(y) ? y : scale1(d);
}

export const TOP = 'TOP';
export const RIGHT = 'RIGHT';
export const BOTTOM = 'BOTTOM';
export const LEFT = 'LEFT';

export function axisPropsFromBandedScale(scale) {
  const values = scale.domain();
  const format = (d) => String(d);

  let offset = scale.bandwidth() / 2;
  const scaleCopy = scale.copy();
  if (scaleCopy.round()) offset = Math.round(offset);
  const position = (d) => scaleCopy(d) + offset;

  return { values, format, position };
}

export function axisPropsFromTickScale(scale, tickCount) {
  const values = scale.ticks(tickCount);
  const format = scale.tickFormat(tickCount);

  const position = scale.copy();

  return { values, format, position };
}

function getAxis({ axisProps, transform }) {
  const valuesWithPos = [];
  const { values, position, format } = axisProps();
  values.map((value) => {
    valuesWithPos.push({
      value,
      transform: transform(position, position, value),
    });
  });
  return { values: valuesWithPos, format };
}

function Axis({
  orient = 'BOTTOM',
  height,
  scale,
  ticks,
  useScaleBand,
  padding,
  formatTick,
}) {
  //   const { range, values, position, format } = React.useMemo(
  //     () =>
  //       useScaleBand
  //         ? axisPropsFromBandedScale(scale)
  //         : axisPropsFromTickScale(scale, ticks),
  //     [scale, ticks]
  //   );

  const { values, format } = React.useMemo(
    () =>
      getAxis({
        axisProps: () =>
          useScaleBand
            ? axisPropsFromBandedScale(scale)
            : axisPropsFromTickScale(scale, ticks),
        transform:
          orient === TOP || orient === BOTTOM ? translateX : translateY,
      }),
    [scale, ticks, useScaleBand]
  );

  const vertical = orient === LEFT || orient === RIGHT;
  const isRight = orient === RIGHT;
  const isLeft = orient === LEFT;
  const isTop = orient === TOP;
  const isBottom = orient === BOTTOM;

  const textProps = {
    color: 'text',
    font: 'caption',
    numberOfLines: 1,
  };

  return (
    <Flex
      height={vertical ? height : 'auto'}
      fill={'none'}
      mr={isLeft ? padding : 0}
      mt={isBottom ? padding : 0}
      position="relative"
      webStyle={{
        userSelect: 'none',
      }}
    >
      {values.map((item, idx) => {
        const v = item.value;
        // textProps[`${x}`] = k * spacing;
        // textProps[`${y}`] = halfWidth;

        return (
          <Flex
            width={vertical ? 'auto' : 1}
            height={!vertical ? 'auto' : 1}
            key={`tick-${idx}`}
            style={{
              position: 'absolute',
              left: vertical ? 0 : item.transform,
              top: vertical ? item.transform : 0,
            }}
            flexCenter
          >
            <Flex
              width={vertical ? 'auto' : 100}
              height={!vertical ? 'auto' : 100}
              flexCenter
            >
              <Text {...textProps}>
                {formatTick ? formatTick(format(v)) : format(v)}
              </Text>
            </Flex>
          </Flex>
        );
      })}
      <Flex opacity={0}>
        {vertical ? (
          values.map((item, idx) => (
            <Text key={`ticks-${idx}`} {...textProps}>
              {formatTick ? formatTick(format(item.value)) : format(item.value)}
            </Text>
          ))
        ) : (
          <Text {...textProps}>{format(values[values.length - 1].value)}</Text>
        )}
      </Flex>
    </Flex>
  );
}

export default React.memo(Axis, (prev, next) => {
  if (JSON.stringify(prev.scale.range()) !== JSON.stringify(next.scale.range()))
    return false;
  if (
    JSON.stringify(prev.scale.domain()) !== JSON.stringify(next.scale.domain())
  )
    return false;
  if (prev.ticks !== next.ticks) return false;
  if (prev.useScaleBand !== next.useScaleBand) return false;
  if (prev.padding !== next.padding) return false;
  return true;
});
