import * as React from 'react';

import Text from '../Text';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Progress from '../Progress';
import Ripple from '../Ripple';

import { withThemeProps } from '../../restyle';

export interface Props {
  children: React.ReactNode;
  onPress: void;
  theme: object;
  loading: boolean;
  progress?: number;
  rounded?: boolean;
  light?: boolean;
  outlined?: boolean;
  clean?: boolean;
  loadingProps?: object;
  [key: string]: any;
}

const Button = ({
  children,
  bg = 'primary',
  color,
  theme,
  onPress,
  size = 44,
  rounded = false,
  light = false,
  outlined = false,
  clean = false,
  loading = false,
  loadingProps = {},
  labelProps = {},
  progress,
  roundness,
  ripple = false,
  rippleProps = {},
  disabled,
  renderLeft = null,
  renderRight = null,
  ...rest
}: Props) => {
  const TouchComp = !onPress && !ripple ? Flex : ripple ? Ripple : Touchable;

  return (
    <TouchComp
      bg={light ? `${bg}:setAlpha:0.1` : clean ? 'transparent' : bg}
      h={size}
      px={size * 0.46}
      onPress={disabled ? undefined : onPress}
      borderRadius={rounded ? size : roundness || theme.globals.roundness}
      justifyContent="center"
      alignItems="center"
      activeOpacity={0.9}
      position="relative"
      disabled={disabled}
      row
      {...rest}
    >
      {loading || progress ? (
        <Flex flexCenter absoluteFill pointerEvents="none">
          <Progress
            trackColor="transparent"
            progressColor={
              color ? color : light ? bg : clean ? 'primary' : '#FFF'
            }
            size={size * 0.5}
            progressWidth={1.5}
            value={progress}
            loading={loading}
            {...loadingProps}
          />
        </Flex>
      ) : null}
      {typeof children === 'string' ? (
        <>
          {renderLeft}
          <Text
            fontSize={size * 0.33}
            color={color ? color : light ? bg : clean ? 'primary' : '#FFF'}
            numberOfLines={1}
            opacity={loading || progress ? 0 : 1}
            pointerEvents="none"
            {...labelProps}
          >
            {children}
          </Text>
          {renderRight}
        </>
      ) : children ? (
        <>
          {renderLeft}
          {React.cloneElement(children, {
            color: color ? color : light ? bg : clean ? 'primary' : '#FFF',
            ...children.props,
            pointerEvents: 'none',
            style: {
              ...(children.props && children.props.style
                ? children.props.style
                : {}),
              opacity: loading ? 0 : 1,
            },
          })}
          {renderRight}
        </>
      ) : null}
    </TouchComp>
  );
};

export default withThemeProps(Button, 'Button');
