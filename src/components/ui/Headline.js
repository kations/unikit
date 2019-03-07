import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";

import Text from "../primitives/Text";

const Headline = styled(Text)`
  display: inline-block;
`;

const Span = styled(Text)`
  display: inline-block;
`;

const AnimatedSpan = animated(Span);

const Comp = ({ level, children, style, ...rest }) => {
  const transitions = useTransition(children.split(""), null, {
    from: { opacity: 0, translateX: 50 },
    enter: { opacity: 1, translateX: 0 },
    leave: { opacity: 0, translateX: 50 }
  });
  // return (
  //   <Headline style={style} ariaLevel="1" {...rest}>
  //     {transitions.map(({ item, key, props }) => (
  //       <AnimatedSpan
  //         style={{
  //           opacity: props.opacity,
  //           transform: [{ translateX: props.translateX }]
  //         }}
  //         key={key}
  //       >
  //         {item}
  //       </AnimatedSpan>
  //     ))}
  //   </Headline>
  // );
  return (
    <Headline
      accessibilityRole="heading"
      aria-level={level}
      style={style}
      comp="headline"
      {...rest}
    >
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

export default Comp;
