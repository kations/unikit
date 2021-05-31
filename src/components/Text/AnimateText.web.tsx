import * as React from 'react';
import AnimateText from '../AnimatedText';

import Text from './Text';

export default ({
  children,
  animateProps = {},
  delay = 0,
  animateType = 'char',
  onVisible = false,
  ...rest
}) => {
  var splittedString = children.split(animateType === 'word' ? ' ' : '');
  const textProps = {};
  return (
    <Text {...rest}>
      {splittedString.map((string, index) => (
        <AnimateText
          key={`char-${index}`}
          delay={delay + index * 50}
          duration={500}
          onVisible={onVisible}
          font={rest.font}
          bold={rest.bold}
          uppercase={rest.uppercase}
          color={rest.color}
          dynamicFontSize={rest.dynamicFontSize}
          accessibilityRole="text"
          visibleNode={Text}
          {...animateProps}
        >
          <Text>{`${string}${animateType === 'word' ? ' ' : ''}`}</Text>
        </AnimateText>
      ))}
    </Text>
  );
};
