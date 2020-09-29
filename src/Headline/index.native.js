import React, { useState } from "react";
import PropTypes from "prop-types";
import { withThemeProps } from "../styled";

import Text from "../Text";
import Flex from "../Flex";
import Animate from "../Animate";
import Visible from "../Visible";

const Headline = withThemeProps(
  ({
    level = 1,
    children,
    style,
    animate,
    animateType = "char",
    onVisible,
    stayVisible = true,
    delay = 100,
    color = "text",
    from,
    to,
    config,
    ...rest
  }) => {
    const [visible, setVisible] = useState(false);
    if (animate) {
      var splittedString = children.split(animateType === "word" ? " " : "");
      return (
        <Flex row {...rest}>
          {onVisible ? (
            <Visible
              disabled={visible && stayVisible}
              onChange={(isVisible) => {
                setVisible(isVisible);
              }}
              offset={100}
            >
              {({ isVisible }) => {
                return <Text />;
              }}
            </Visible>
          ) : null}
          {splittedString.map((string, index) => (
            <Animate
              isVisible={!onVisible || (onVisible && visible)}
              key={`char-${index}`}
              delay={index * 50}
            >
              <Text level={level} style={style} color={color} {...rest}>
                {`${string}${animateType === "word" ? " " : ""}`}
              </Text>
            </Animate>
          ))}
        </Flex>
      );
    }

    return (
      <Text level={level} style={style} color={color} {...rest}>
        {children}
      </Text>
    );
  },
  "Headline"
);

Headline.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node,
  style: PropTypes.object,
  animate: PropTypes.bool,
  animateType: PropTypes.oneOf(["char", "word"]),
};

Headline.defaultPropTypes = {
  level: 1,
  animateType: "char",
  stayVisible: true,
  delay: 100,
};

export default Headline;
