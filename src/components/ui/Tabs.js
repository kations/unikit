import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView
} from "react-native";
import { useSpring, animated } from "react-spring/native";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import Swiper from "./Swiper";
import Box from "../primitives/Box";

const AnimatedIndicator = animated(View);

const isString = option => {
  return typeof option === "string" ? true : false;
};

const Comp = props => {
  const {
    value,
    onChange,
    style,
    options,
    children,
    indicatorHeight,
    borderRadius,
    swipeIndex,
    hideLabels,
    ...rest
  } = props;

  const scrollRef = useRef(null);
  const theme = useTheme();

  const { select, item, track, label, indicator } = defaultStyle(props, theme);

  const selectedIndex = options.findIndex(
    option => option === value || option.value === value
  );

  const [state, setState] = useState({
    width: 0,
    swipeIndex: selectedIndex || 0,
    index: selectedIndex || 0,
    swipe: false
  });

  const width = state.width / options.length;

  useEffect(() => {
    const newIndex =
      swipeIndex && swipeIndex !== state.swipeIndex
        ? swipeIndex
        : selectedIndex;

    setState({
      ...state,
      index: Math.round(newIndex),
      swipeIndex: newIndex
    });
  }, [selectedIndex, swipeIndex]);

  const springStyle = useSpring({
    x: Math.round(state.swipeIndex * width),
    width: width,
    config: { mass: 1, tension: 300, friction: 30 }
  });

  const TabsComp = (
    <Box
      style={select}
      onLayout={({ nativeEvent }) => {
        const width = state.width / options.length;
        setState({
          ...state,
          width: nativeEvent.layout.width
        });
      }}
    >
      <ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps={
          getProp(props, theme, "keyboardShouldPersistTaps", "tabs") || false
        }
        scrollEnabled={getProp(props, theme, "scrollable", "tabs") || false}
      >
        <View style={track}>
          {options.map((option, index) => {
            const active = index === state.index ? true : false;
            return (
              <TouchableOpacity
                style={StyleSheet.flatten([
                  item,
                  {
                    width: width
                  }
                ])}
                active={state.index === index}
                activeOpacity={state.index === index ? 1 : 0.6}
                onPress={() => {
                  setState({
                    ...state,
                    index: index,
                    swipeIndex: index,
                    swipe: true
                  });

                  if (onChange) {
                    onChange(isString(option) ? option : option.value);
                  }
                }}
                key={`item-${index}`}
              >
                {!hideLabels && (
                  <Text
                    style={StyleSheet.flatten([
                      label,
                      {
                        color: getProp(
                          props,
                          theme,
                          "color",
                          "tabs",
                          active ? "indicatorColor" : undefined,
                          active
                        )
                      }
                    ])}
                    active={Math.round(state.swipeIndex) === index}
                  >
                    {isString(option) ? option : option.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {value && (
          <AnimatedIndicator
            style={StyleSheet.flatten([
              indicator,
              {
                transform: springStyle.x.interpolate(x => [{ translateX: x }]),
                width: width
              }
            ])}
            indicatorHeight={indicatorHeight}
            borderRadius={borderRadius}
          />
        )}
      </ScrollView>
    </Box>
  );

  if (children) {
    return (
      <Box style={style} {...rest}>
        {TabsComp}
        <Swiper
          index={state.index}
          swipeIndex={state.swipeIndex}
          onSwipe={swipeIndex => {
            if (!state.swipe) {
              setState({
                ...state,
                swipeIndex: swipeIndex,
                index: Math.round(swipeIndex)
              });
            } else if (swipeIndex === state.index) {
              setState({
                ...state,
                swipe: false
              });
            }
          }}
          onSwipeEnd={index => {
            console.log("onSwipeEnd", index);
            setState({
              ...state,
              index: index,
              swipeIndex: index,
              swipe: false
            });
          }}
          flex={props.flex || style.flex || 0}
        >
          {children}
        </Swiper>
      </Box>
    );
  } else {
    return (
      <Box style={style} {...rest}>
        {TabsComp}
      </Box>
    );
  }
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    select: {
      flex: 0,
      flexBasis: getProp(props, theme, "tabsHeight", "tabs"),
      position: "relative",
      height: getProp(props, theme, "tabsHeight", "tabs"),
      width: "100%",
      backgroundColor: getProp(props, theme, "backgroundColor", "tabs"),
      borderRadius: getProp(props, theme, "borderRadius", "tabs"),
      flexDirection: "row",
      justifyContent: "space-between",
      overflow: "hidden"
    },
    track: {
      position: "relative",
      flexDirection: "row",
      height: "100%",
      zIndex: 10
    },
    item: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center"
    },
    label: {
      fontSize: 14,
      color: getProp(props, theme, "color", "tabs", "backgroundColor")
    },
    indicator: {
      position: "absolute",
      height: getProp(props, theme, "indicatorHeight", "tabs"),
      left: 0,
      top: 0,
      backgroundColor: getProp(props, theme, "indicatorColor", "tabs"),
      borderRadius: getProp(props, theme, "borderRadius", "tabs"),
      zIndex: 0
    }
  });

Comp.defaultProps = {
  threshold: 5,
  style: {}
};

export default Comp;
