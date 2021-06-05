import * as React from 'react';
import { Flex, Text, Button } from 'unikit';
var reactDocs = require('react-docgen');

export default function App({ textFile = '' }) {
  var componentInfo = reactDocs.parse(`
  import * as React from 'react';

import styled from '../../style/styled';
import Gradient from '../Gradient';
import Text from '../Text';
import Flex from '../Flex';
import Animate from '../Animate';
import Progress from '../Progress';

import { withThemeProps } from '../../style';
import { colorAware, isFunction } from '../../util';

const Pressable = styled.Pressable();
const ImageBackground = styled.ImageBackground();

export interface Props {
  /** As a result, this valu */
  children: React.ReactNode;
  image: string;
  imageProps: object;
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
  theme,
  onPress,
  bg = 'primary',
  image,
  imageProps = {},
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
  const borderRadius = rounded ? size / 2 : theme.globals.roundness;

  const C = onPress ? Pressable : Flex;
  const cProps = onPress
    ? {
        onPress,
        onHoverIn: () => setHover(true),
        onPressIn: () => setHover(true),
        onHoverOut: () => setHover(false),
        onPressOut: () => setHover(false),
        accessibilityRole: 'button',
      }
    : {};

  const textColor = color
    ? color
    : colorAware(
        gradient === true ? theme.colors.gradient[0] : gradient || bg,
        theme
      );

  const renderChild = (child) =>
    React.cloneElement(child, {
      color: textColor,
      ...child.props,
      pointerEvents: 'none',
      style: {
        ...(child.props && child.props.style ? child.props.style : {}),
        opacity: loading ? 0 : 1,
        zIndex: 10,
      },
    });

  return (
    <Animate
      duration={300}
      {...(animateMode === 'fade'
        ? { from: { opacity: 1 }, to: { opacity: hover ? 0.9 : 1 } }
        : { from: { scale: 1 }, to: { scale: hover ? 1.03 : 1 } })}
      {...animateProps}
    >
      <C
        bg={gradient ? undefined : bg}
        h={size}
        px={size / 2}
        borderRadius={borderRadius}
        opacity={disabled ? 0.5 : 1}
        flexCenter
        row
        relative
        {...cProps}
        {...rest}
      >
        {gradient ? (
          <Flex
            borderRadius={borderRadius}
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
        {image ? (
          <ImageBackground
            source={image}
            borderRadius={borderRadius}
            overflow="hidden"
            zIndex={0}
            absoluteFill
            {...imageProps}
          />
        ) : null}

        {loading || progress ? (
          <Flex flexCenter absoluteFill pointerEvents="none">
            <Progress
              trackColor="transparent"
              progressColor={textColor}
              size={size * 0.5}
              progressWidth={1.5}
              value={progress}
              loading={loading}
              {...loadingProps}
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
          renderChild(children)
        )}
        {renderRight
          ? isFunction(renderRight)
            ? renderRight({ color: textColor })
            : renderRight
          : null}
      </C>
    </Animate>
  );
};

export default withThemeProps(Button, 'Button');

  `);
  console.log({ componentInfo });
  return (
    <Flex w="100%" mt={30}>
      {Object.keys(componentInfo.props).map((key, i) => {
        const { required, defaultValue, flowType, description } =
          componentInfo.props[key];
        return (
          <Flex
            key={key}
            my={10}
            borderTopWidth={1}
            borderColor="text:setAlpha:0.1"
            borderRadius={10}
          >
            <Flex p={15} flex={1} row>
              <Button
                size={40}
                pr={required ? 6 : undefined}
                renderRight={
                  required ? (
                    <Button bg="primary:darken:7" ml={12} size={30}>
                      required
                    </Button>
                  ) : null
                }
                rounded
              >
                {`${key}`}
              </Button>
            </Flex>
            {defaultValue?.value ? (
              <Flex px={20} mt={10} row>
                <Text w={200}>Default</Text>
                <Text bold>{defaultValue?.value || ''}</Text>
              </Flex>
            ) : null}
            <Flex px={20} mt={10} row>
              <Text w={200}>Type</Text>
              <Text bold>{flowType?.name || ''}</Text>
            </Flex>
            {description ? (
              <Flex px={20} mt={10} row>
                <Text w={200}>Description</Text>
                <Text>{description}</Text>
              </Flex>
            ) : null}
          </Flex>
        );
      })}
    </Flex>
  );
}
