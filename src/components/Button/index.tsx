import * as React from 'react';

import styled from '../../style/styled';
import Gradient from '../Gradient';
import Text from '../Text';
import Flex from '../Flex';
import Animate from '../Animate';
import { withThemeProps } from '../../style';
import { isWeb } from '../../util';

const Pressable = styled.Pressable();

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

export const Button = ({
  theme,
  bg = 'primary',
  gradient,
  color,
  children,
  size = 50,
  rounded = false,
  disabled = false,
  loading = false,
  progress,
  animateMode = 'fade', //fade
  renderLeft,
  renderRight,
  animateProps = {},
  loadingProps = {},
  labelProps = {},
  gradientProps = {},
  ...rest
}: Props) => {
  const [hover, setHover] = React.useState(false);

  return (
    <Animate
      duration={300}
      {...(animateMode === 'fade'
        ? { from: { opacity: 1 }, to: { opacity: hover ? 0.9 : 1 } }
        : { from: { scale: 1 }, to: { scale: hover ? 1.03 : 1 } })}
      {...animateProps}
    >
      <Pressable
        bg={gradient ? undefined : bg}
        h={size}
        px={size / 2}
        borderRadius={rounded ? size / 2 : 0}
        position="relative"
        onHoverIn={() => setHover(true)}
        onPressIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
        onPressOut={() => setHover(false)}
        opacity={disabled ? 0.5 : 1}
        accessibilityRole="button"
        flexCenter
        row
        {...rest}
      >
        {gradient ? (
          <Flex
            borderRadius={rounded ? size / 2 : 0}
            overflow="hidden"
            zIndex={0}
            absoluteFill
          >
            <Gradient
              colors={gradient === true ? undefined : gradient}
              {...gradientProps}
            />
          </Flex>
        ) : null}

        {renderLeft}
        {typeof children === 'string' ? (
          <Text
            fontSize={size * 0.33}
            color={color}
            colorAware={
              color
                ? undefined
                : gradient === true
                ? theme.colors.gradient[0]
                : gradient || bg
            }
            numberOfLines={1}
            opacity={loading || progress ? 0 : 1}
            pointerEvents="none"
            zIndex={10}
            {...labelProps}
          >
            {children}
          </Text>
        ) : (
          React.cloneElement(children, {
            color: color ? color : light ? bg : clean ? 'primary' : '#FFF',
            ...children.props,
            pointerEvents: 'none',
            style: {
              ...(children.props && children.props.style
                ? children.props.style
                : {}),
              opacity: loading ? 0 : 1,
            },
          })
        )}
        {renderRight}
      </Pressable>
    </Animate>
  );
};

export default withThemeProps(Button, 'Button');
