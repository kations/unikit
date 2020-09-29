import React, { useState, useEffect, useMemo } from 'react';
import t from 'prop-types';
import { TouchableOpacity, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { svgPathProperties } from 'svg-path-properties';

import styled, { useTheme, withThemeProps } from '../styled';
import Box from '../Box';
import icons from './icons';
import { isDark } from '../util';

const Icon = styled(Box)(({ size }) => ({
  position: 'relative',
  width: size,
  height: size,
}));

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedIcon = ({ size, withBg, color, iconProps }) => {
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const theme = useTheme();
  const strokeDasharray = useMemo(
    () => new svgPathProperties(iconProps.d).getTotalLength(),
    [iconProps.d]
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const t = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [strokeDasharray, 0],
  });

  return (
    <Svg width={size} height={size} style={{ backgroundColor: 'transparent' }}>
      {withBg ? (
        <Path
          {...iconProps}
          style={{
            stroke: theme.colors[color] || color,
            fill: 'transparent',
            opacity: 0.2,
          }}
        />
      ) : null}
      <AnimatedPath
        {...iconProps}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={t}
      />
    </Svg>
  );
};

const Comp = withThemeProps(
  ({
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
    onPress,
    ...rest
  }) => {
    const [icon, setIcon] = useState(icons[name] || path || icons['x']);
    const theme = useTheme();

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
      <Icon
        as={onPress ? TouchableOpacity : undefined}
        onPress={onPress || null}
        activeOpacity={onPress ? 0.8 : undefined}
        size={size}
        {...rest}
      >
        {animate ? (
          <AnimatedIcon
            key={icon}
            size={size}
            color={color}
            withBg={withBg}
            iconProps={iconProps}
          />
        ) : (
          <Svg
            width={size}
            height={size}
            style={{ backgroundColor: 'transparent' }}
          >
            <Path {...iconProps} />
          </Svg>
        )}
      </Icon>
    );
  },
  'Icon'
);

Comp.propTypes = {
  size: t.number,
  strokeWidth: t.number,
  lineCap: t.string,
  fill: t.bool,
  name: t.string,
  color: t.string,
  animate: t.bool,
  /** Show a faded stroke if animate */
  withBg: t.bool,
  animateOpacity: t.bool,
  springConfig: t.object,
  onPress: t.func,
};

Comp.defaultPropTypes = {
  size: 44,
  strokeWidth: 1.5,
  lineCap: 'round',
  fill: false,
  name: 'x',
  color: 'primary',
  animate: false,
  withBg: true,
  springConfig: { config: { duration: 750 } },
};

export default Comp;
