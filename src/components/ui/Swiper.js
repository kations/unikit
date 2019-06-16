import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { View, ScrollView, StyleSheet } from "react-native";
//import { disablePageScroll, enablePageScroll } from "scroll-lock";

import Box from "../primitives/Box";
// import Tabs from "./Tabs";

const AnimatedContent = animated(View);

const Comp = props => {
  const {
    onSwipe,
    onSwipeEnd,
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
    vertical,
    ...rest
  } = props;

  const scrollRef = useRef(null);

  const { root, wrap, dotswrap } = defaultStyle(props);

  const [state, setState] = useState({
    width: itemSize || 0,
    height: itemSize || 0,
    swipeIndex: 0,
    index: 0,
    offset: {
      x: 0,
      y: 0
    }
  });

  useEffect(() => {
    const newIndex =
      swipeIndex && swipeIndex !== state.swipeIndex ? swipeIndex : index;

    setState({
      ...state,
      index: Math.round(newIndex)
    });
    // if (index !== state.index) {
    //   setState({ ...state, index: index, swipeIndex: index });
    // }
    // if (swipeIndex !== state.swipeIndex) {
    //   setState({
    //     ...state,
    //     swipeIndex: swipeIndex,
    //     offset: {
    //       x: swipeIndex * -state.width,
    //       y: 0
    //     }
    //   });
    // }
  }, [index, swipeIndex]);

  useEffect(() => {
    scrollRef.current.scrollTo({
      x: vertical ? 0 : state.index * state.width,
      y: vertical ? state.index * state.width : 0,
      animated: true
    });
  }, [state.index]);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        const maxIndex = React.Children.count(children) - 1;
        const newIndex = state.index + 1 > maxIndex ? 0 : state.index + 1;
        setState({ ...state, index: newIndex });
      }, duration);

      return () => clearInterval(interval);
    } else {
      return () => null;
    }
  });

  // const contentSpring = useSpring({
  //   to: {
  //     left: state.swipeIndex * -state.width,
  //     moveX: state.moveX,
  //     swipeIndex: state.swipeIndex
  //   },
  //   config: { mass: 1, tension: 300, friction: 30 },
  //   immediate: name => state.swipe && name === "moveX"
  // });

  return (
    <Box
      onLayout={({ nativeEvent }) => {
        const width = itemSize || nativeEvent.layout.width;
        setState({
          ...state,
          width: width,
          offset: {
            x: vertical ? 0 : state.index * width,
            y: vertical ? state.index * width : 0
          }
        });
      }}
      style={StyleSheet.flatten([
        root,
        {
          flex: flex || undefined
        },
        style
      ])}
      {...rest}
    >
      <ScrollView
        ref={scrollRef}
        style={wrap}
        horizontal={!vertical}
        pagingEnabled
        snapToInterval={state.width}
        decelerationRate="fast"
        snapToAlignment="left"
        automaticallyAdjustContentInsets={false}
        scrollsToTop={false}
        bounces={true}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        disableScrollViewPanResponder
        contentOffset={state.offset}
        alwaysBounceVertical={false}
        keyboardDismissMode="on-drag"
        onScroll={({ nativeEvent }) => {
          //if (Platform.OS === "web") disablePageScroll();
          if (!vertical) {
            var swipeIndex = nativeEvent.contentOffset.x / state.width;
          } else {
            var swipeIndex = nativeEvent.contentOffset.y / state.width;
          }

          if (onSwipe) onSwipe(swipeIndex);
          setState({ ...state, swipeIndex: swipeIndex });
        }}
        onMomentumScrollEnd={({ nativeEvent }) => {
          //if (Platform.OS === "web") enablePageScroll();
          var indexNew = Math.round(nativeEvent.contentOffset.x / state.width);
          if (!vertical) {
            var indexNew = Math.round(
              nativeEvent.contentOffset.x / state.width
            );
          } else {
            var indexNew = Math.round(
              nativeEvent.contentOffset.y / state.width
            );
          }
          console.log("onMomentumScrollEnd");
          if (onSwipeEnd) onSwipeEnd(indexNew);
          setState({
            ...state,
            index: indexNew
          });
        }}
        style={{
          flex: flex || undefined,
          flexDirection: vertical ? "column" : "row"
        }}
        contentContainerStyle={{
          width: vertical ? "100%" : "auto"
        }}
      >
        {React.Children.map(children, (child, index) => {
          return (
            <AnimatedContent
              style={{
                flex: 1,
                padding: gap / 2,
                width: vertical ? "100%" : state.width,
                height: vertical ? state.width : "100%"
              }}
            >
              {child}
            </AnimatedContent>
          );
        })}
      </ScrollView>
      {/* {dots && (
        <Box
          style={StyleSheet.flatten([
            dotswrap,
            {
              [dotsPosition]: dotsOffset
            }
          ])}
        >
          {{React.Children.map(children, (child, index) => (
            <Dot active={index === state.index} />
          ))}}
          <Tabs
            style={{
              width: 70,
              height: 6,
              backgroundColor: "rgba(0,0,0,0.2)",
              transform: [{ rotate: vertical ? "90deg" : "0deg" }]
            }}
            onChange={(value, index) => {
              setState({ ...state, index: index });
            }}
            borderRadius={3}
            value={`${state.index}`}
            swipeIndex={state.swipeIndex}
            options={React.Children.map(children, (child, index) => `${index}`)}
            hideLabels
          />
        </Box>
      )} */}
    </Box>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    root: {
      width: "100%",
      position: "relative"
    },
    wrap: {
      flexDirection: "row"
    },
    dotswrap: {
      position: "absolute",
      left: props.dotsPosition !== "right" ? 0 : "auto",
      right: props.dotsPosition === "right" ? 0 : "auto",
      bottom: props.dotsPosition === "bottom" ? 0 : "auto",
      top: props.dotsPosition !== "bottom" ? 0 : "auto",
      display: "flex",
      justifyContent: "center",
      flexDirection:
        props.dotsPosition === "bottom" || p.dotsPosition === "top"
          ? "row"
          : "column",
      width:
        props.dotsPosition === "bottom" || p.dotsPosition === "top"
          ? "100%"
          : "auto",
      height:
        props.dotsPosition === "bottom" || p.dotsPosition === "top"
          ? "auto"
          : "100%"
    }
  });

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
  vertical: false,
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
