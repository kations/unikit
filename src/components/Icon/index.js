import React, { useState, useEffect, useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { withThemeProps } from '../../restyle';
import { isDark } from '../../utils';

import Flex from '../Flex';
import AnimatedPath from '../AnimatedPath';

import icons from './icons';

const Icon = ({
  theme,
  path,
  size = 44,
  strokeWidth = 1.5,
  lineCap = 'round',
  fill = false,
  name,
  color = 'primary',
  animate = false,
  withBg = true,
  bgAware,
  springConfig = { config: { duration: 750 } },
  ...rest
}) => {
  const [icon, setIcon] = useState(icons[name] || path || icons['x']);

  if (bgAware) {
    color = isDark(theme.colors[bgAware] || bgAware) ? '#FFF' : '#000';
  }

  useEffect(() => {
    setIcon(icons[name] || path || icons['x']);
  }, [name]);

  const iconProps = {
    d: icon,
    scale: size / 24,
    strokeWidth,
    strokeLinecap: lineCap,
    strokeDashoffset: 0,
    fill: fill ? theme.colors[color] || color : 'transparent',
    style: {
      fill: fill ? theme.colors[color] || color : 'transparent',
      stroke: theme.colors[color] || color,
    },
  };

  return (
    <Flex w={size} h={size} relative {...rest}>
      <Svg
        width={size}
        height={size}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ backgroundColor: 'transparent' }}
      >
        {(animate && withBg) || !animate ? (
          <Path
            {...iconProps}
            style={{ ...iconProps.style, opacity: withBg && animate ? 0.2 : 1 }}
          />
        ) : null}
        {animate && <AnimatedPath key={name || d} {...iconProps} />}
      </Svg>
    </Flex>
  );
};

export default withThemeProps(Icon, 'Icon');
