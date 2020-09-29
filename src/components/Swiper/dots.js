import * as React from 'react';
import PropTypes from 'prop-types';

import Flex from '../Flex';
import Animate from '../Animate';

import { withThemeProps } from '../../restyle';

const dotsPositionStyle = {
  top: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottom: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  left: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
};

export function Dots({
  items = [],
  onPress,
  index = 0,
  position = 'bottom',
  vertical = false,
  offset = 10,
  dotProps = {},
  roundness = 7,
  trackSize = 10,
  itemSize = 20,
  indicatorColor,
  trackColor,
  springConfig = {},
  ...rest
}) {
  return (
    <Flex
      p={offset}
      pointerEvents="box-none"
      {...rest}
      style={{ ...dotsPositionStyle[position] }}
      absoluteFill
    >
      <Flex
        bg={trackColor || 'background'}
        bgAlpha={0.2}
        w={vertical ? trackSize : items.length * itemSize}
        h={!vertical ? trackSize : items.length * itemSize}
        relative
        borderRadius={roundness}
        row={!vertical}
      >
        <Animate
          to={vertical ? { y: index * itemSize } : { z: index * itemSize }}
          bg={indicatorColor || 'primary'}
          absolute
          t={0}
          l={0}
          width={vertical ? '100%' : `${100 / items.length}%`}
          height={!vertical ? '100%' : `${100 / items.length}%`}
          borderRadius={roundness}
        />
        {items.map((child, i) => (
          <Flex
            width={vertical ? '100%' : `${100 / items.length}%`}
            height={!vertical ? '100%' : `${100 / items.length}%`}
            active={index === i}
            onPress={() => onPress(i)}
            key={i}
            {...dotProps}
          />
        ))}
      </Flex>
    </Flex>
  );
}

Dots.propTypes = {
  activeIndex: PropTypes.number,
  dotsPosition: PropTypes.string,
  dotsOffset: PropTypes.number,
  dotProps: PropTypes.object,
};

export default withThemeProps(Dots, 'Dots');
