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

const fontLevel = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
};

export default ({ children, level, font, animate = false, ...rest }: Props) => {
  if (!level && font) level = fontLevel[font];
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
  console.log({ textProps });
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
