import React, { Fragment } from "react";
import { Platform, View, Text } from "react-native";
import PropTypes from "prop-types";

import styled from "../../style/styled";
import Animate from "./Animate";

const Headline = styled.Text(({ level }) => ({
  color: "text",
  fontSize: `h${level}`
}));

const Comp = ({
  level = 1,
  children,
  style,
  animate,
  animateType = "word",
  onVisible,
  delay = 100,
  from,
  to,
  config,
  ...rest
}) => {
  if (animate) {
    var splittedString = children.split(animateType === "word" ? " " : "");
    return (
      <Headline
        style={
          Platform.OS !== "web"
            ? { ...style, ...{ flexDirection: "row" } }
            : style
        }
        accessibilityRole={Platform.OS === "web" ? "heading" : undefined}
        aria-level={level}
        level={level}
        comp="headline"
        {...rest}
      >
        {splittedString.map((char, index) => (
          <Animate
            key={`${index}-${char}`}
            delay={index * delay}
            as={Text}
            config={config}
            from={from || { opacity: 0, y: 50 }}
            to={to}
            onVisible={onVisible}
            style={{
              ...(Platform.OS === "web" ? { display: "inline-block" } : {})
            }}
          >
            {char}
            {animateType === "word" ? " " : null}
          </Animate>
        ))}
      </Headline>
    );
  }

  return (
    <Headline
      accessibilityRole={Platform.OS === "web" ? "heading" : undefined}
      aria-level={level}
      level={level}
      style={style}
      comp="headline"
      {...rest}
    >
      {children}
    </Headline>
  );
};

Comp.propTypes = {
  children: PropTypes.node,
  as: PropTypes.string,
  style: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object
};

export default Comp;
