import React, { Fragment, useState, useEffect } from 'react';
import { View } from 'react-native';

import { withThemeProps } from '../../restyle';
import { useUpdateEffect, useVisibilitySensor } from '../../hooks';
import Flex from '../Flex';

interface Props {
  children: React.ReactNode;
  theme: object;
  from?: object;
  to?: object;
  stayVisible?: boolean;
  onVisible?: boolean;
  delay?: number;
  duration?: number;
  config: object;
  loop: boolean;
  [key: string]: any;
}

const cleanKeys = (keys) => {
  const transformKeys = {};
  transformKeys['transform'] = [];
  if (keys.y !== undefined) {
    transformKeys['transform'].push({ translateY: keys.y });
  }
  if (keys.x !== undefined) {
    transformKeys['transform'].push({ translateX: keys.x });
  }
  if (keys.o !== undefined) {
    transformKeys['opacity'] = keys.o;
  }
  if (keys.s !== undefined) {
    transformKeys['transform'] = `scale(${keys.s})`;
  }
  if (keys.r !== undefined) {
    transformKeys['transform'] = `rotate(${keys.r}deg)`;
  }
  return transformKeys;
};

const Animate = ({
  from = { o: 0, y: 100, x: 0 },
  to = { o: 1, y: 0, x: 0 },
  as,
  children,
  stayVisible = true,
  onVisible,
  isVisible = true,
  delay = 0,
  duration = 500,
  offset = 0,
  loop = false,
  config,
  style,
  useTransition = false,
  ...rest
}: Props) => {
  const [reverse, setReverse] = useState(false);
  const [visible, setVisible] = useState(
    onVisible || delay !== 0 ? false : isVisible
  );
  const { bindVisibility } = useVisibilitySensor({
    stayVisible,
    onChange: (vis) => {
      if (onVisible) setVisible(vis);
    },
  });

  config = {
    easing: 'easeInOutBack',
    ...config,
  };

  useEffect(() => {
    if (isVisible && delay) {
      setTimeout(() => {
        setVisible(true);
      }, delay);
    }
  }, []);

  useUpdateEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (visible === true && reverse === false) {
      setTimeout(() => {
        setReverse(true);
      }, duration);
    }
  }, [visible]);

  const fromKeys = cleanKeys(from);
  const toKeys = cleanKeys(to);

  const demo = {
    '0%': fromKeys,
    '100%': toKeys,
  };

  const demoRev = {
    '0%': toKeys,
    '100%': fromKeys,
  };

  const aniStyle = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationKeyframes: demo,
    animationIterationCount: loop ? 'infinite' : 1,
    animationFillMode: 'both',
  };

  const aniStyleRev = {
    animationDelay: `0ms`,
    animationDuration: `${duration}ms`,
    animationKeyframes: demoRev,
    animationIterationCount: loop ? 'infinite' : 1,
  };

  const styling = useTransition
    ? {
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: config.easing,
        transitionProperty: ['opacity', 'transform'],
        ...(visible ? toKeys : fromKeys),
      }
    : {
        ...style,
        ...demo['0%'],
        animationFillMode: `both`,
        animationTimingFunction: config.easing,
        ...((!visible && onVisible) || isVisible === false ? {} : aniStyle),
        ...(reverse && !visible ? aniStyleRev : {}),
      };

  const Comp = as ? as : Flex;

  return (
    <Comp style={styling} {...rest}>
      {onVisible && <View {...bindVisibility} />}
      {children}
    </Comp>
  );
};

Animate.defaultPropTypes = {
  from: { o: 0, y: 100, x: 0 },
  to: { o: 1, y: 0, x: 0 },
  stayVisible: true,
  isVisible: true,
};

export default withThemeProps(Animate, 'Animate');
