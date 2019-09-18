import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ScrollView, FlatList } from "react-native";

// import Tabs from "./Tabs";
import styled, { useTheme } from "../styled";
import Box from "../Box";

const Content = styled(Box)(({ vertical, gap, itemSize }) => ({
  width: vertical ? "100%" : itemSize,
  height: !vertical ? "100%" : itemSize,
  padding: gap / 2
}));

const Comp = props => {
  const {
    useScrollView = false,
    onSwipe,
    onSwipeEnd,
    onChangeIndex,
    index,
    swipeIndex,
    style,
    itemSize,
    children,
    gap,
    scale,
    flex,
    dots,
    dotsPosition,
    dotsOffset,
    autoplay,
    duration,
    vertical = false,
    updateSwipe = true,
    ...rest
  } = props;

  const scrollRef = useRef(null);
  const theme = useTheme();

  const [selectedIndex, setIndex] = useState(index);
  const [width, setWidth] = useState(itemSize || theme.width || 0);

  const scrollTo = () => {
    if (useScrollView) {
      scrollRef.current.scrollTo({
        x: vertical ? 0 : index * width,
        y: vertical ? index * width : 0,
        animated: true
      });
    } else {
      scrollRef.current.scrollToOffset({ offset: index * width });
    }
  };

  useEffect(() => {
    if (!(index % 1 != 0) && index !== selectedIndex) {
      console.log({ index });
      setIndex(index);
      scrollTo();
    }
  }, [index]);

  useEffect(() => {
    if (!(selectedIndex % 1 != 0)) {
      if (onSwipeEnd) onSwipeEnd(selectedIndex);
    }
  }, [selectedIndex]);

  const defaultProps = {
    ref: scrollRef,
    pagingEnabled: true,
    snapToInterval: width,
    horizontal: !vertical,
    automaticallyAdjustContentInsets: false,
    scrollsToTop: false,
    bounces: true,
    scrollEventThrottle: 16,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    directionalLockEnabled: true,
    disableScrollViewPanResponder: true,
    callbackOffsetMargin: 5,
    enableMomentum: false,
    decelerationRate: "fast",
    snapToAlignment: "left",
    alwaysBounceVertical: false,
    keyboardDismissMode: "on-drag",
    style: {
      flex: 1,
      width: "100%",
      height: vertical ? width : "auto",
      position: "relative",
      padding: gap / 2,
      flexDirection: vertical ? "column" : "row",
      ...style
    },
    onLayout: ({ nativeEvent }) => {
      const { width, height } = nativeEvent.layout;
      if (vertical) {
        setWidth(itemSize || height);
      } else {
        setWidth(itemSize || width);
      }
    },
    onScroll: ({ nativeEvent }) => {
      const { x, y } = nativeEvent.contentOffset;
      if (!vertical) {
        var swipeIndex = x / width;
      } else {
        var swipeIndex = y / width;
      }
      setIndex(swipeIndex);
      if (onSwipe && updateSwipe) onSwipe(swipeIndex);
    },
    onMomentumScrollBegin: ({ nativeEvent }) => {
      console.log("onMomentumScrollBegin");
    },
    onMomentumScrollEnd: ({ nativeEvent }) => {
      const { x, y } = nativeEvent.contentOffset;
      if (!vertical) {
        var indexNew = Math.round(x / width);
      } else {
        var indexNew = Math.round(y / width);
      }
      console.log("onMomentumScrollEnd");
      if (onSwipeEnd) onSwipeEnd(indexNew);
      setIndex(indexNew);
    }
  };

  if (useScrollView) {
    return (
      <ScrollView
        contentContainerStyle={{
          width: vertical ? "100%" : "auto"
        }}
        {...defaultProps}
        {...rest}
      >
        {React.Children.map(children, (child, i) => {
          if (child) {
            return (
              <Content itemSize={width} gap={gap} vertical={vertical} key={i}>
                {child}
              </Content>
            );
          }
        })}
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={children}
      renderItem={({ item, index }) => {
        if (item) {
          return (
            <Content itemSize={width} gap={gap} vertical={vertical}>
              {item}
            </Content>
          );
        }
      }}
      keyExtractor={(item, index) => index.toString()}
      getItemLayout={(data, index) => ({
        length: width,
        offset: width * index,
        index
      })}
      contentContainerStyle={{
        width: vertical ? "100%" : "auto",
        flexGrow: 1
      }}
      initialScrollIndex={index}
      {...defaultProps}
      {...rest}
    />
  );
};

Comp.propTypes = {
  index: PropTypes.number,
  swipeIndex: PropTypes.number,
  threshold: PropTypes.number,
  hysteresis: PropTypes.number,
  children: PropTypes.node.isRequired,
  onSwipe: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  scale: PropTypes.bool
};

Comp.defaultProps = {
  flex: undefined,
  index: 0,
  gap: 0,
  swipeIndex: 0,
  threshold: 5,
  hysteresis: 0.6,
  dotsPosition: "bottom",
  dotsOffset: 20,
  dots: false,
  autoplay: false,
  duration: 3000
};

export default Comp;
