import React, { useState, forwardRef, useImperativeHandle } from "react";
import { ScrollView, FlatList, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  runOnJS,
} from "react-native-reanimated";

import Flex from "../Flex";

import { withThemeProps, Touchable } from "../../style";
import { useLayout, useInterval } from "../../hooks";

import Icon from "../Icon";

const AnimatedList = Animated.createAnimatedComponent(ScrollView);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedFlex = Animated.createAnimatedComponent(Flex);

function SwipeItem({
  translation,
  children,
  itemSize,
  vertical,
  inactiveScale = 0.8,
  inactiveOpacity = 0.8,
  spacer = 0,
  offset = 0,
  width = "100%",
  height = "100%",
  ...rest
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [offset - itemSize, offset, offset + itemSize];
    const scaleOutputRange = [inactiveScale, 1, inactiveScale];
    const opacityOutputRange = [inactiveOpacity, 1, inactiveOpacity];
    const spacerOutputRange = [spacer, spacer, spacer * 1.5];

    const transform = [
      {
        scale: interpolate(translation.value, inputRange, scaleOutputRange),
      },
      {
        translateX: vertical
          ? 0
          : interpolate(translation.value, inputRange, spacerOutputRange),
      },
      {
        translateY: !vertical
          ? 0
          : interpolate(translation.value, inputRange, spacerOutputRange),
      },
    ];

    return {
      position: "relative",
      opacity: interpolate(translation.value, inputRange, opacityOutputRange),
      transform,
    };
  }, [inactiveScale, inactiveOpacity, itemSize, offset, spacer]);

  return (
    <AnimatedFlex
      w={vertical ? width : itemSize}
      h={!vertical ? height : itemSize}
      collapsable={false}
      style={animatedStyle}
      {...rest}
    >
      {children}
    </AnimatedFlex>
  );
}

function Dots({
  size = 100,
  translation,
  itemSize,
  itemsCount,
  offset = 20,
  vertical,
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const progress =
      translation.value > 0
        ? getProgress(0, itemSize * itemsCount - itemSize, translation.value)
        : 0;
    if (vertical) {
      return {
        height: `${progress * 100}%`,
      };
    } else {
      return {
        width: `${progress * 100}%`,
      };
    }
  }, [itemsCount, itemSize]);

  return (
    <Flex
      collapsable={false}
      absolute
      r={vertical ? offset : 0}
      b={vertical ? 0 : offset}
      w={vertical ? "auto" : "100%"}
      h={!vertical ? "auto" : "100%"}
      zIndex={999}
      pointerEvents="none"
      center
    >
      <Flex
        w={vertical ? 5 : "30%"}
        h={vertical ? "30%" : 5}
        maxWidth={size}
        maxHeight={size}
        borderRadius={5}
        bg="surface"
      >
        <AnimatedFlex
          h="100%"
          bg="primary"
          borderRadius={5}
          style={animatedStyle}
        />
      </Flex>
    </Flex>
  );
}

export const getProgress = (a: number, b: number, v: number) => {
  "worklet";
  const p = (v - a) / (b - a);
  return parseFloat(p.toFixed(3));
};

export const getValueByProgress = (start: number, end: number, t: number) => {
  "worklet";
  return start * (1 - t) + end * t;
};

export function Swiper(
  {
    activeIndex = 0,
    children,
    vertical = false,
    autoplay = false,
    loop = false,
    arrows = false,
    arrowSize = 40,
    snapTo = "start",
    arrowProps = { color: "#FFF", strokeWidth: 0.5 },
    arrowWrapperProps = {},
    arrowDisabledAlpha = 0.3,
    dots = false,
    dotsSize = 10,
    itemProps = {},
    listProps = {},
    autoplayTimeout = 3000,
    onSwipe,
    onSwipeEnd,
    onChange,
    renderOnActive = false,
    gap = 0,
    itemDimension,
    inactiveScale = 0.8,
    inactiveOpacity = 0.8,
    useFlatList = false,
    ...rest
  },
  ref
) {
  const scrollViewRef = React.useRef(null);
  const [index, setIndex] = useState(activeIndex);
  const items = React.Children.toArray(children);
  const itemsCount = items.length;
  const { onLayout, width, height } = useLayout();

  if (typeof itemDimension === "string") {
    itemDimension =
      (parseFloat(itemDimension.replace("%", "")) / 100) *
        (vertical ? height : width) +
      gap / items.length;
  }

  React.useEffect(() => {
    if (onChange) onChange(index);
  }, [index]);

  const getRef = React.useCallback(() => {
    if (!scrollViewRef.current) return;
    return scrollViewRef.current;
  }, []);

  const scrollTo = (index: number, animated = true) => {
    if (getRef()) {
      if (useFlatList) {
        getRef().scrollToOffset({ offset: index * itemSize, animated });
      } else {
        getRef().scrollTo({ x: index * itemSize, y: 0, animated });
      }

      setIndex(index);
    }
  };

  useInterval(
    () => {
      scrollTo((index + 1) % items.length);
    },
    autoplay ? autoplayTimeout : null
  );

  useImperativeHandle(ref, () => ({
    swipeNext: () => {
      scrollTo(index + 1);
    },
    swipePrev: () => {
      scrollTo(index - 1);
    },
    swipeTo: (newIndex) => {
      scrollTo(newIndex);
    },
  }));

  let itemSize = itemDimension ? itemDimension : vertical ? height : width;
  if (vertical && itemSize > height) itemSize = height;
  if (!vertical && itemSize > width) itemSize = width;

  const translation = useSharedValue(0);
  const page = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        const { x, y } = event.contentOffset;
        const value = vertical ? y : x;
        const size = vertical
          ? event.contentSize.height
          : event.contentSize.width;
        const progress = getProgress(0, size, value);
        const newIndex = Math.round(
          getValueByProgress(0, itemsCount, progress)
        );
        if (newIndex !== page.value) {
          runOnJS(setIndex)(newIndex);
          page.value = newIndex;
        }
        translation.value = value;
      },
    },
    [itemsCount, index, page]
  );

  const itemPropss = vertical
    ? { h: itemSize, py: gap / 2 }
    : { w: itemSize, px: gap / 2 };
  const adderSize =
    itemSize < width && !vertical
      ? width - itemSize
      : itemSize < height && vertical
      ? height - itemSize
      : 0;

  const renderItem = ({ item, i }) => {
    const isActive = index === i;
    return (
      <SwipeItem
        key={`${itemSize}-${i}`}
        translation={translation}
        itemSize={itemSize}
        offset={itemSize * i}
        vertical={vertical}
        inactiveScale={inactiveScale}
        inactiveOpacity={inactiveOpacity}
        width={useFlatList ? width : undefined}
        height={useFlatList ? height : undefined}
        spacer={
          snapTo === "center"
            ? ((!vertical ? width : height) - itemSize) / 2
            : 0
        }
        zIndex={isActive ? 999 : 0}
        {...itemPropss}
      >
        {item}
      </SwipeItem>
    );
  };

  const List = useFlatList ? AnimatedFlatList : AnimatedList;
  const ListProps = useFlatList
    ? {
        data: items,
        renderItem: ({ item, index }) => renderItem({ item, i: index }),
      }
    : {};

  return (
    <Flex onLayout={onLayout} flex={1} relative {...rest}>
      <List
        ref={scrollViewRef}
        style={{ width: "100%" }}
        horizontal={!vertical}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        pagingEnabled
        snapToInterval={itemSize}
        snapToEnd={false}
        snapToStart={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        decelerationRate="fast"
        directionalLockEnabled
        disableScrollViewPanResponder
        {...ListProps}
        {...listProps}
        contentContainerStyle={{
          width: vertical ? "100%" : itemSize * items.length + adderSize,
          height: !vertical ? "100%" : itemSize * items.length + adderSize,
          ...(listProps?.contentContainerStyle || {}),
        }}
      >
        {useFlatList
          ? null
          : items.map((child, i) => {
              return renderItem({ item: child, i });
            })}
      </List>

      {dots ? (
        <Dots
          translation={translation}
          itemSize={itemSize}
          itemsCount={itemsCount}
          dotsSize={dotsSize}
          vertical={vertical}
        />
      ) : null}

      {arrows ? (
        <Flex
          absoluteFill
          row={!vertical}
          alignItems="center"
          justifyContent="space-between"
          pointerEvents="box-none"
          {...arrowWrapperProps}
        >
          <Touchable
            onPress={() => scrollTo(index - 1)}
            opacity={index > 0 ? 1 : arrowDisabledAlpha}
            key={`arrow-left-${index}`}
          >
            <Icon
              name={vertical ? "chevron-up" : "chevron-left"}
              size={arrowSize}
              {...arrowProps}
            />
          </Touchable>
          <Touchable
            onPress={() => scrollTo(index + 1)}
            opacity={index < items.length - 1 ? 1 : arrowDisabledAlpha}
            key={`arrow-right-${index}`}
          >
            <Icon
              name={vertical ? "chevron-down" : "chevron-right"}
              size={arrowSize}
              {...arrowProps}
            />
          </Touchable>
        </Flex>
      ) : null}
    </Flex>
  );
}

export default withThemeProps(forwardRef(Swiper), "Swiper");
