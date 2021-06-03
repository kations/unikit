import React from 'react';
import { withThemeProps } from '../../style';

import Button from '../Button';

const getShort = (char: string) => {
  let short = '';
  const split = char.split(' ');
  split.map((s: string, i: number) => {
    if (i < 2) {
      short = short + s.charAt(0).toUpperCase();
    }
  });
  return short;
};

export interface Props {
  children: React.ReactNode;
  bg: string;
  size: number;
  char: string;
  charShort?: boolean;
  color?: string;
  onPress?: () => void;
  source?: string;
  roundness?: number;
  imageProps?: object;
  labelProps?: object;
  [key: string]: any;
}

const Avatar = ({
  bg = 'primary',
  children,
  size = 44,
  char = '',
  charShort = false,
  color = '#FFF',
  onPress,
  source,
  imageProps = {},
  labelProps = { bold: true },
  roundness,
  ...rest
}: Props) => {
  return (
    <Button
      bg={bg}
      image={source}
      as={onPress ? Button : undefined}
      onPress={onPress || null}
      activeOpacity={onPress ? 0.8 : undefined}
      size={size}
      width={size}
      rounded={!roundness}
      roundness={roundness}
      px={0}
      labelProps={labelProps}
      {...rest}
    >
      {children ? children : charShort ? getShort(char) : char}
    </Button>
  );
};

export default withThemeProps(Avatar, 'Avatar');
