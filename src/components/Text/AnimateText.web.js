import * as React from 'react';
import Animate from '../Animate';
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
    <Text
      {...rest}
      style={{
        wordWrap: 'break-word',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {splittedString.map((string, index) => (
        <Animate
          as={Text}
          key={`char-${index}`}
          delay={delay + index * 50}
          style={{ display: 'inline-block' }}
          {...animateProps}
        >
          {`${string}${animateType === 'word' ? ' ' : ''}`}
        </Animate>
      ))}
    </Text>
  );
};
