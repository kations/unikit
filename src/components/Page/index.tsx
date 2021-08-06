import * as React from 'react';
import { ScrollView, SafeAreaView, Platform, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  withSpring,
} from 'react-native-reanimated';

import Flex from '../Flex';
import Text from '../Text';
import Gradient from '../Gradient';

import { withThemeProps, styled, transformColor } from '../../style';

const AnimatedList = Animated.createAnimatedComponent(ScrollView);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedFlex = Animated.createAnimatedComponent(Flex);
const AnimatedText = Animated.createAnimatedComponent(styled.Text());

export const getProgress = (a: number, b: number, v: number) => {
  'worklet';
  const p = (v - a) / (b - a);
  return parseFloat(p.toFixed(3));
};

const MAX = 999999999;

function Navbar({
  theme,
  title,
  titleProps = {},
  top,
  inset = 0,
  offset = 20,
  distance = 100,
  roundness = 10,
  leftAction = null,
  rightAction = null,
  maxWidth = '99%',
  gap = 10,
  setHeight,
  bg = 'primary',
  color = 'text',
  stopColor = '#FFF',
  stopScale = 0.8,
  gradient = ['accent', 'primary'],
  animateBg = true,
  ...rest
}) {
  const insets = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => {
    const y = interpolate(top.value, [0, distance, MAX], [offset, 0, 0]);
    return {
      transform: [
        {
          translateY: withSpring(y),
        },
      ],
    };
  }, []);

  const animatedBg = useAnimatedStyle(() => {
    return {
      opacity: interpolate(top.value, [0, distance], [0, 1]),
    };
  }, []);

  const animatedTitle = useAnimatedStyle(() => {
    const scale = interpolate(
      top.value,
      [0, distance, MAX],
      [1, stopScale, stopScale]
    );
    return {
      transform: [
        {
          scale: withSpring(scale),
        },
      ],
    };
  }, []);

  const c1 = transformColor({ value: color, theme, themeKey: 'colors' });
  const c2 = transformColor({ value: stopColor, theme, themeKey: 'colors' });
  const animatedColorStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(top.value, [0, distance], [c1, c2]),
    };
  }, []);

  console.log({ animatedColorStyle });

  return (
    <AnimatedFlex
      absolute
      r={0}
      l={0}
      t={0}
      pt={insets.top}
      w="100%"
      zIndex={999}
      center
      style={animatedStyle}
      {...rest}
    >
      <AnimatedFlex
        w="100%"
        h={200}
        absolute
        r={0}
        l={0}
        b={0}
        bg={bg}
        borderRadius={roundness}
        style={animateBg ? animatedBg : {}}
        overflow="hidden"
      >
        {gradient ? <Gradient colors={gradient} absoluteFill /> : null}
      </AnimatedFlex>
      <Flex
        w="100%"
        h={55}
        justifyContent="space-between"
        alignItems="center"
        maxWidth={maxWidth}
        px={gap}
        row
      >
        <Flex zIndex={888}>{leftAction}</Flex>
        <AnimatedFlex
          zIndex={555}
          center
          style={animatedTitle}
          absoluteFill
          pointerEvents="box-none"
        >
          <AnimatedText
            maxWidth="70%"
            font="h4"
            key={title}
            numberOfLines={1}
            bold
            style={animatedColorStyle}
            {...titleProps}
          >
            {title}
          </AnimatedText>
        </AnimatedFlex>
        <Flex zIndex={888}>{rightAction}</Flex>
      </Flex>
    </AnimatedFlex>
  );
}

interface Props {
  children: React.ReactNode;
  onPress: void;
  theme: object;
  rounded?: boolean;
  light?: boolean;
  outlined?: boolean;
  [key: string]: any;
}

const Page = ({
  theme,
  bg = 'background',
  children,
  hasSafeArea,
  scrollable = true,
  renderHeader,
  renderFooter,
  scrollProps,
  scrollComponent,
  onScroll,
  scrollTop,
  scrollAnimated = true,
  useFlatList = false,
  withNavbar = true,
  navbarProps = {},
  navbarComponent,
  title,
  leftAction = null,
  rightAction = null,
  ...rest
}: Props) => {
  const spacerHeight =
    55 + (navbarProps.offset || 20) + (navbarProps.inset || 0);
  const scrollViewRef = React.useRef(null);
  const top = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        const { y } = event.contentOffset;
        top.value = y;
      },
    },
    []
  );

  const ScrollComp = useFlatList ? AnimatedFlatList : AnimatedList;
  const Scroller = scrollable ? scrollComponent || ScrollComp : React.Fragment;
  const ScrollerProps = React.useMemo(() => {
    return {
      ref: scrollViewRef,
      onScroll: scrollHandler,
      scrollEventThrottle: 16,
      showsVerticalScrollIndicator: false,
      ...scrollProps,
      style: {
        ...(scrollProps?.style || {}),
        flex: 1,
        paddingTop: useFlatList ? (isWeb ? spacerHeight / 2 : spacerHeight) : 0,
        paddingBottom: spacerHeight,
      },
    };
  }, [useFlatList, scrollProps, spacerHeight]);

  return (
    <Flex
      flex={1}
      h="100vh"
      bg={bg}
      as={hasSafeArea ? SafeAreaView : undefined}
      accessibilityRole={Platform.OS === 'web' ? 'main' : 'none'}
      webStyle={{ transitionDuration: '0.5s', transitionProperty: 'all' }}
      {...rest}
    >
      {withNavbar ? (
        <Navbar
          theme={theme}
          title={title}
          leftAction={leftAction}
          rightAction={rightAction}
          top={top}
          {...navbarProps}
        />
      ) : null}
      {renderHeader ? renderHeader({ top }) : null}
      <Scroller {...(scrollable ? ScrollerProps : {})}>
        {useFlatList || !withNavbar ? null : <Flex h={spacerHeight} w="100%" />}
        {children}
      </Scroller>
      {renderFooter ? renderFooter({ top }) : null}
    </Flex>
  );
};

export default withThemeProps(Page, 'Page');
