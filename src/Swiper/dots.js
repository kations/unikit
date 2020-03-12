import React, { useState } from "react";
import PropTypes from "prop-types";
import { animated, useSpring } from "react-spring/native";

import styled, { withThemeProps } from "../styled";

const dotsPositionStyle = {
  top: {
    alignItems: "center",
    justifyContent: "flex-start"
  },
  bottom: {
    alignItems: "center",
    justifyContent: "flex-end"
  },
  left: {
    alignItems: "flex-start",
    justifyContent: "center"
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center"
  }
};

const Wrapper = styled.View({
  absoluteFill: true
});

const Track = styled.View();

const Dot = styled.TouchableOpacity({
  web: { cursor: "pointer" }
});

const Indicator = animated(styled.View());

export function Dots({
  items = [],
  onPress,
  index = 0,
  position = "bottom",
  vertical = false,
  offset = 10,
  dotProps = {},
  roundness = 7,
  trackSize = 10,
  itemSize = 20,
  indicatorColor,
  trackColor,
  springConfig = { config: {} },
  ...rest
}) {
  const { dist } = useSpring({
    to: { dist: index * itemSize },
    ...springConfig
  });

  return (
    <Wrapper
      p={offset}
      pointerEvents="box-none"
      {...rest}
      style={{ ...dotsPositionStyle[position] }}
    >
      <Track
        bg={trackColor || "background"}
        bgAlpha={0.2}
        w={vertical ? trackSize : items.length * itemSize}
        h={!vertical ? trackSize : items.length * itemSize}
        relative
        borderRadius={roundness}
        row={!vertical}
      >
        <Indicator
          bg={indicatorColor || "primary"}
          absolute
          t={0}
          l={0}
          width={vertical ? "100%" : `${100 / items.length}%`}
          height={!vertical ? "100%" : `${100 / items.length}%`}
          borderRadius={roundness}
          style={{
            transform: vertical
              ? [{ translateY: dist }]
              : [{ translateX: dist }]
          }}
        />
        {items.map((child, i) => (
          <Dot
            width={vertical ? "100%" : `${100 / items.length}%`}
            height={!vertical ? "100%" : `${100 / items.length}%`}
            active={index === i}
            onPress={() => onPress(i)}
            key={i}
            {...dotProps}
          />
        ))}
      </Track>
    </Wrapper>
  );
}

Dots.propTypes = {
  activeIndex: PropTypes.number,
  dotsPosition: PropTypes.string,
  dotsOffset: PropTypes.number,
  dotProps: PropTypes.object
};

export default withThemeProps(Dots, "Dots");
