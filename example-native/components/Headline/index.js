import React from "react";
import styled from "styled-components";
import { Text } from "react-native";
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";

const Headline = styled(Text)`
  display: inline-block;
  color: ${p => p.theme.unikit.colors.text};
`;

const Span = styled(Text)`
  display: inline-block;
`;

const AnimatedSpan = animated(Span);

const Comp = ({ as, children, style }) => {
  const transitions = useTransition(children.split(""), null, {
    from: { opacity: 0, translateX: 50 },
    enter: { opacity: 1, translateX: 0 },
    leave: { opacity: 0, translateX: 50 }
  });
  return (
    <Headline as={as} style={style}>
      {transitions.map(({ item, key, props }) => (
        <AnimatedSpan
          as="span"
          style={{
            opacity: props.opacity,
            transform: [{ translateX: props.translateX }]
          }}
          key={key}
        >
          {item}
        </AnimatedSpan>
      ))}
    </Headline>
  );
  return (
    <Headline as={as} style={style}>
      {children}
    </Headline>
  );
};

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

Comp.defaultProps = {
  as: "h1"
};

export default Comp;
