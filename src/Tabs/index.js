import React, { useState, useEffect, Fragment } from "react";
import { useSpring, animated } from "react-spring/native";

import styled from "../styled";
import Box from "../Box";
import Swiper from "../Swiper";
import Ripple from "../Ripple";

const Tabs = styled(Box)(({ roundness, gap, tabsSize, vertical }) => ({
  width: vertical ? tabsSize + gap * 2 : "100%",
  height: vertical ? "100%" : tabsSize + gap * 2,
  borderRadius: roundness > 0 ? roundness + gap : roundness,
  overflow: "hidden",
  padding: gap
}));

const Track = styled.View(({ tabsSize, vertical }) => ({
  position: "relative",
  height: vertical ? "100%" : tabsSize,
  width: vertical ? tabsSize : "100%",
  flexDirection: vertical ? "column" : "row",
  justifyContent: "space-between",
  backgroundColor: "transparent",
  zIndex: 0
}));

const Tab = styled.TouchableOpacity(({ active, vertical }) => ({
  position: "relative",
  height: "100%",
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100
}));

const TabLabel = styled.Text(({ active, activeColor, color }) => ({
  fontSize: "label",
  color: active ? activeColor : color
}));

const Indicator = animated(
  styled(Box)(({ roundness, vertical }) => ({
    position: "absolute",
    left: 0,
    bottom: vertical ? "auto" : 0,
    top: vertical ? 0 : "auto",
    borderRadius: roundness,
    zIndex: 10
  }))
);

const isString = option => {
  return typeof option === "string" ? true : false;
};

const Comp = props => {
  const {
    value,
    onChange,
    options,
    children,
    indicatorSize = "100%",
    indicatorColor = "primary",
    gap = 0,
    roundness = 0,
    swipeIndex,
    hideLabels,
    tabsSize = 50,
    backgroundColor = "surface",
    activeColor = "#FFF",
    color = "primary",
    swiperProps = {},
    indicatorProps = {},
    tabProps = {},
    tabLabelProps = {},
    trackProps = {},
    vertical = false,
    ripple = false,
    ...rest
  } = props;
  const tabValue = value || options[0].value || options[0];

  const findIndex = options.findIndex(
    option => option === tabValue || option.value === tabValue
  );

  const [selectedIndex, setIndex] = useState(findIndex);
  const [swipe, setSwipe] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setIndex(findIndex);
  }, [findIndex]);

  useEffect(() => {
    if (!swipe) {
      setIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const { x } = useSpring({
    x: Math.round(selectedIndex * (width / options.length)),
    config: { mass: 1, tension: 300, friction: 30, duration: 300 },
    onRest: () => setSwipe(false)
  });

  const TabsComp = (
    <Tabs
      bg={backgroundColor}
      roundness={roundness}
      gap={gap}
      tabsSize={tabsSize}
      vertical={vertical}
      {...rest}
    >
      <Track
        tabsSize={tabsSize}
        vertical={vertical}
        onLayout={({ nativeEvent }) => {
          const { width, height } = nativeEvent.layout;
          setWidth(vertical ? height : width);
        }}
        {...trackProps}
      >
        {options.map((option, index) => {
          const active = Math.round(selectedIndex) === index;
          return (
            <Tab
              as={ripple ? Ripple : undefined}
              rippleColor={ripple ? indicatorColor : undefined}
              size={ripple ? tabsSize * 2 : undefined}
              active={active}
              vertical={vertical}
              activeOpacity={active ? 1 : 0.8}
              overflow={true}
              onPress={() => {
                setSwipe(true);
                setIndex(index);
                // setTimeout(() => {
                //   setSwipe(false);
                // }, 3000);

                if (onChange) {
                  onChange(isString(option) ? option : option.value);
                }
              }}
              key={`item-${index}`}
              {...tabProps}
            >
              {!hideLabels && (
                <TabLabel
                  active={active}
                  activeColor={activeColor}
                  color={color}
                  {...tabLabelProps}
                >
                  {isString(option) ? option : option.label}
                </TabLabel>
              )}
            </Tab>
          );
        })}

        <Indicator
          bg={indicatorColor}
          vertical={vertical}
          roundness={roundness}
          {...indicatorProps}
          style={{
            ...indicatorProps.style,
            transform: vertical ? [{ translateY: x }] : [{ translateX: x }],
            width: vertical ? indicatorSize : `${100 / options.length}%`,
            height: !vertical ? indicatorSize : `${100 / options.length}%`
          }}
        />
      </Track>
    </Tabs>
  );

  if (children) {
    return (
      <Fragment>
        {TabsComp}
        <Swiper
          updateSwipe={!swipe}
          index={selectedIndex}
          onSwipe={(swipeIndex, index) => {
            setIndex(swipeIndex);
          }}
          onSwipeEnd={index => {
            console.log("onSwipeEnd", index);
            setIndex(index);
          }}
          {...swiperProps}
        >
          {children}
        </Swiper>
      </Fragment>
    );
  } else {
    return TabsComp;
  }
};

export default Comp;
