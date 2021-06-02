import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

import icons from './icons';
import { withThemeProps } from '../../style';
import AnimatedPath from '../AnimatedPath';

interface Props {
  theme: object;
  name: string;
  size?: number;
  color?: string;
  strokeLinecap?: string;
  strokeLinejoin?: string;
  strokeWidth?: number;
  fill?: boolean;
  animate?: boolean;
  duration?: number;
  delay?: number;
  [key: string]: any;
}

const Icon = ({
  theme,
  name = 'activity',
  size = 24,
  color = 'primary',
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  strokeWidth = 2,
  fill = false,
  animate = false,
  duration,
  delay = 250,
  ...rest
}: Props) => {
  const paths = icons[name];
  const PathComp = React.useMemo(
    () => (animate ? AnimatedPath : Path),
    [animate]
  );
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      fill={fill ? theme.colors[color] || color : 'transparent'}
      stroke={theme.colors[color] || color}
      strokeWidth={strokeWidth}
      {...rest}
    >
      {paths.map((path, i) => {
        return (
          <PathComp
            key={`${name}-${i}`}
            d={path}
            duration={duration}
            delay={delay * i}
          />
        );
      })}
    </Svg>
  );
};

export default withThemeProps(Icon, 'Icon');
