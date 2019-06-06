import React, { Fragment } from "react";
import { Platform, StyleSheet, Text as DefaultText } from "react-native";
import PropTypes from "prop-types";

import Text from "../primitives/Text";
import Animate from "./Animate";

const Comp = ({ level = 1, children, style, animated, ...rest }) => {
  const { text, span } = defaultStyle;
  if (animated) {
    var splittedString = children.split("");
    return (
      <Text
        style={StyleSheet.flatten([text, style])}
        accessibilityRole={Platform.OS === "web" ? "heading" : undefined}
        aria-level={level}
        comp="headline"
        {...rest}
      >
        {splittedString.map((char, index) => (
          <Animate
            key={`${index}-${char}`}
            delay={index * 25}
            config={{ mass: 1, tension: 180, friction: 12 }}
            as={DefaultText}
          >
            {char}
          </Animate>
        ))}
      </Text>
    );
  }

  return (
    <Text
      accessibilityRole={Platform.OS === "web" ? "heading" : undefined}
      aria-level={level}
      style={StyleSheet.flatten([text, style])}
      comp="headline"
      {...rest}
    >
      {children}
    </Text>
  );
};

const defaultStyle = StyleSheet.create({
  text: {
    display: Platform.OS === "web" ? "inline-block" : "flex",
    flexDirection: "row",
    fontSize: 30
  },
  span: {
    display: Platform.OS === "web" ? "inline-block" : "flex"
  }
});

// const transitions = useTransition(text, null, {
//   from: { opacity: 0 },
//   enter: { opacity: 1 },
//   leave: { opacity: 0 }
// })
// return transitions.map(({ item, key, props }) => (
//   <animated.div style={props}>{item}</animated.div>
// ))

Comp.propTypes = {
  children: PropTypes.node,
  as: PropTypes.string,
  style: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object
};

export default Comp;
