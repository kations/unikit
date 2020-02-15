import React, { useState } from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";
import { animated, useTransition } from "react-spring/native";

import styled from "../styled";
import Visible from "../Visible";
import Text from "../Text";
import Box from "../Box";

const AnimatedView = animated(styled.View({}));

const Animated = animated(Text);

const AnimatedText = ({ strings = [], level = 1, animateType }) => {
  const transitions = useTransition(strings, data => data, {
    from: { opacity: 0, y: 100, x: 0 },
    leave: { opacity: 0, y: 100, x: 0 },
    enter: { opacity: 1, y: 0, x: 0 },
    update: { opacity: 1, y: 0, x: 0 },
    unique: false,
    trail: 400 / strings.length
  });
  if (Platform.OS !== "web") {
    return transitions.map(({ item, props: { opacity, x, y }, key }, index) => (
      <AnimatedView
        key={`${key}-${index}`}
        style={{
          opacity: opacity,
          transform: [{ translateY: y || 0 }, { translateX: x || 0 }]
        }}
      >
        <Text level={level}>
          {item}
          {animateType === "word" ? " " : null}
        </Text>
      </AnimatedView>
    ));
  }
  return transitions.map(({ item, props: { opacity, x, y }, key }, index) => (
    <Animated
      key={`${key}-${index}`}
      style={{
        opacity: opacity,
        transform: [{ translateY: y || 0 }, { translateX: x || 0 }]
      }}
    >
      {item}
      {animateType === "word" ? " " : null}
    </Animated>
  ));
};

export default function Headline({
  level = 1,
  children,
  style,
  animate,
  animateType = "char",
  onVisible,
  stayVisible = true,
  delay = 100,
  from,
  to,
  config,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  if (animate) {
    var splittedString = children.split(animateType === "word" ? " " : "");
    return (
      <Text
        {...(Platform.OS !== "web" ? { as: Box } : {})}
        style={
          Platform.OS !== "web"
            ? { ...style, ...{ flexDirection: "row" } }
            : style
        }
        level={level}
        {...rest}
      >
        {onVisible ? (
          <Visible
            disabled={visible && stayVisible}
            onChange={isVisible => {
              setVisible(isVisible);
            }}
            offset={100}
          >
            {({ isVisible }) => {
              return <Text />;
            }}
          </Visible>
        ) : null}

        <AnimatedText
          strings={(onVisible && visible) || !onVisible ? splittedString : []}
          animateType={animateType}
        />
      </Text>
    );
  }

  return (
    <Text level={level} style={style} {...rest}>
      {children}
    </Text>
  );
}

Headline.propTypes = {
  children: PropTypes.node,
  as: PropTypes.string,
  style: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object
};
