import React, { Fragment, useState, useEffect } from 'react';
import { View } from 'react-native';

import { withThemeProps, styled } from '../../restyle';
import { Animated, useSpring } from '../../spring';
import { useUpdateEffect, useVisibilitySensor } from '../../hooks';

const { concat } = Animated;

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
  [key: string]: any;
}

const Box = styled(Animated.View)();

const getValue = (obj, key, defaultValue) => {
  return obj[key] !== undefined ? obj[key] : defaultValue;
};

const Animate = ({
  from = { o: 0, y: 100, x: 0 },
  to = { o: 1, y: 0, x: 0 },
  children,
  stayVisible = true,
  onVisible,
  isVisible = true,
  loop = false,
  delay,
  duration,
  count,
  config,
  style,
  ...rest
}: Props) => {
  const [visible, setVisible] = useState(false);
  const { bindVisibility } = useVisibilitySensor({
    stayVisible,
    onChange: (vis) => {
      if (onVisible) setVisible(vis);
    },
  });

  const springProps = {
    loop,
    config: {
      duration,
      ...config,
    },
  };

  const x = useSpring({
    to: visible ? getValue(to, 'x', 0) : getValue(from, 'x', 0),
    ...springProps,
  });
  const y = useSpring({
    to: visible ? getValue(to, 'y', 0) : getValue(from, 'y', 0),
    ...springProps,
  });

  const s = useSpring({
    to: visible ? getValue(to, 's', 1) : getValue(from, 's', 1),
    ...springProps,
  });

  const r = useSpring({
    to: visible ? getValue(to, 'r', 1) : getValue(from, 'r', 1),
    ...springProps,
  });

  const o = useSpring({
    to: visible ? getValue(to, 'o', 0) : getValue(from, 'o', 0),
    ...springProps,
  });

  useEffect(() => {
    if (isVisible && !onVisible) {
      if (delay) {
        setTimeout(() => {
          setVisible(true);
        }, delay);
      } else {
        setVisible(true);
      }
    }
  }, []);

  useUpdateEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  const opacity = getValue(from, 'o') !== undefined ? o : 1;
  const transform = [];
  if (getValue(from, 'x') !== undefined) {
    transform.push({ translateX: x });
  }
  if (getValue(from, 'y') !== undefined) {
    transform.push({ translateY: y });
  }

  if (getValue(from, 's') !== undefined) {
    transform.push({ scale: s });
  }

  if (getValue(from, 'r') !== undefined) {
    transform.push({ rotate: concat(r, 'deg') });
  }

  return (
    <Box
      style={{
        ...style,
        opacity,
        transform,
      }}
      pointerEvents={visible ? 'auto' : 'none'}
      {...rest}
    >
      {onVisible && <View {...bindVisibility} />}
      {children}
    </Box>
  );
};

Animate.defaultPropTypes = {
  from: { o: 0, y: 100, x: 0 },
  to: { o: 1, y: 0, x: 0 },
  stayVisible: true,
  isVisible: true,
};

export default withThemeProps(Animate, 'Animate');
