import * as React from 'react';
import Animate from '../Animate';
import { Text as Txt } from 'react-native';

import Flex from '../Flex';
import Text from './Text';

export default ({
  children,
  animateProps = {},
  delay = 0,
  animateType = 'char',
  ...rest
}) => {
  var splittedString = children.split(animateType === 'word' ? ' ' : '');
  return (
    <Flex
      justifyContent={rest.textAlign === 'center' ? 'center' : 'flex-start'}
      row
      wrap
      {...rest}
    >
      {splittedString.map((string, index) => (
        <Animate
          key={`char-${index}`}
          delay={delay + index * 50}
          {...animateProps}
        >
          <Text
            font={rest.font}
            bold={rest.bold}
            uppercase={rest.uppercase}
            color={rest.color}
          >{`${string}${animateType === 'word' ? ' ' : ''}`}</Text>
        </Animate>
      ))}
    </Flex>
  );
};
