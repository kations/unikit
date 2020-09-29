import * as React from 'react';
import PropTypes from 'prop-types';

import styled, { withThemeProps } from '../styled';
import { AnimatedView, useSpring, Animated } from '../Spring';
import { getValueByProgress, getProgress } from '../util';

const Track = styled.View();
const Step = styled.View();
const Indicator = styled(AnimatedView)();
const { concat } = Animated;

export function Dots({
  value = 3,
  min = 0,
  max = 100,
  vertical = false,
  roundness = 3,
  trackSize = 10,
  itemSize = 20,
  indicatorColor,
  trackColor,
  steps = 0,
  stepSize = 2,
  stepColor = 'surface',
  stepColors = ['error', 'warning', 'success'],
  springConfig = {},
  ...rest
}) {
  const progress = React.useMemo(() => getProgress(min, max, value), [value]);
  const width = useSpring({
    to: progress * 100,
    config: springConfig,
  });

  if (steps > 0 && !indicatorColor) {
    var colorIndex = getValueByProgress(
      0,
      stepColors.length - 1,
      getProgress(min, max, value)
    );
    if (colorIndex < 1) colorIndex = 0;
    indicatorColor = stepColors[Math.round(colorIndex)];
  }

  return (
    <Track
      bg={trackColor || 'background'}
      bgAlpha={0.72}
      w={vertical ? trackSize : '100%'}
      h={!vertical ? trackSize : '100%'}
      relative
      borderRadius={roundness}
      overflow="hidden"
      {...rest}
    >
      <Indicator
        bg={indicatorColor || 'primary'}
        absolute
        t={0}
        l={0}
        style={{
          width: vertical ? '100%' : concat(width, '%'),
          height: !vertical ? '100%' : concat(width, '%'),
        }}
      />
      {Array.from(Array(steps).keys()).map(index => {
        if (index === 0) return null;
        return (
          <Step
            key={`step-${index}`}
            absolute
            t={0}
            l={`${index * (100 / steps)}%`}
            bg={stepColor}
            w={vertical ? '100%' : stepSize}
            h={!vertical ? '100%' : stepSize}
          />
        );
      })}
    </Track>
  );
}

Dots.propTypes = {
  activeIndex: PropTypes.number,
  dotsPosition: PropTypes.string,
  dotsOffset: PropTypes.number,
  dotProps: PropTypes.object,
};

export default withThemeProps(Dots, 'Dots');
