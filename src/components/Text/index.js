import * as React from 'react';
import { Platform } from 'react-native';

import Text from './Text';
import AnimateText from './AnimateText';

interface Props {
  children: React.ReactNode;
  level: number;
  font: string;
  animate: boolean;
  delay: number;
  animateProps: object;
  animateType: 'char' | 'word';
  [key: string]: any;
}

export default ({ children, level, font, animate = false, ...rest }: Props) => {
  const textProps = {
    level,
    font: level && !font ? `h${level}` : font || 'default',
    ...Platform.select({
      web: {
        ...(level ? { 'aria-level': `${level}` } : {}),
        accessibilityRole: level ? 'heading' : 'text',
      },
      default: {
        accessibilityRole: 'text',
      },
    }),
    ...rest,
  };
  if (animate) {
    return (
      <AnimateText color="text" {...textProps} {...rest}>
        {children}
      </AnimateText>
    );
  }
  return (
    <Text color="text" {...textProps} {...rest}>
      {children}
    </Text>
  );
};
