import React from 'react';
import { ImageBackground } from 'react-native';
import { withThemeProps } from '../../restyle';

import Button from '../Button';
import Text from '../Text';

const getShort = (char) => {
  let short = '';
  const split = char.split(' ');
  split.map((s, i) => {
    if (i < 2) {
      short = short + s.charAt(0).toUpperCase();
    }
  });
  return short;
};

const Avatar = ({
  bg = 'primary',
  children,
  size = 44,
  char = '',
  formatChar = false,
  color = '#FFF',
  onPress,
  source,
  imageProps = {},
  labelProps = {},
  roundness,
  ...rest
}) => {
  return (
    <Button
      bg={bg}
      as={onPress ? Button : undefined}
      onPress={onPress || null}
      activeOpacity={onPress ? 0.8 : undefined}
      size={size}
      width={size}
      rounded={!roundness}
      roundness={roundness}
      px={0}
      {...rest}
    >
      <>
        {source ? (
          <ImageBackground
            source={source}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: roundness || size / 2,
              zIndex: 0,
              overflow: 'hidden',
            }}
            {...imageProps}
          />
        ) : null}
        {children ? (
          children
        ) : (
          <Text
            bgAware={bg}
            fontSize={size * 0.33}
            color={color}
            style={{ position: 'relative', zIndex: 100 }}
            bold
            {...labelProps}
          >
            {formatChar ? getShort(char) : char}
          </Text>
        )}
      </>
    </Button>
  );
};

export default withThemeProps(Avatar, 'Avatar');
