import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";

import UniText from "../Text";
import Animate from "../Animate";

export default function Headline({
  level = 1,
  children,
  animate,
  animateType = "char",
  onVisible,
  stayVisible = true,
  delay = 100,
  duration,
  from,
  to,
  config,
  ...rest
}) {
  if (animate) {
    var splittedString = children.split(animateType === "word" ? " " : "");
    return (
      <UniText level={level} style={{ wordWrap: "break-word" }} {...rest}>
        {splittedString.map((string, index) => {
          return (
            <Animate
              key={`${string}-${index}`}
              as={Text}
              style={{ display: "inline-block" }}
              onVisible={onVisible}
              delay={
                delay +
                index * (duration ? duration / splittedString.length : 20)
              }
            >
              {string}
              {animateType === "word" ? " " : null}
            </Animate>
          );
        })}
      </UniText>
    );
  }

  return (
    <UniText level={level} {...rest}>
      {children}
    </UniText>
  );
}

Headline.propTypes = {
  children: PropTypes.node,
  as: PropTypes.string,
  style: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object
};
