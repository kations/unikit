import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { View } from "react-native-web";
import Visible from "../helper/Visible";

const Comp = props => {
  const {
    from,
    to,
    children,
    isVisible,
    stayVisible,
    onVisible,
    delay,
    reset,
    reverse,
    config,
    style,
    as
  } = props;

  const [state, setState] = useState({
    active: onVisible ? false : true,
    wasActive: false
  });

  let visible = state.active || isVisible;

  const aniStyle = useSpring({
    from: from,
    to: state.active ? to : from,
    config: config || undefined,
    delay: delay || 0,
    reset: reset || false,
    reverse: reverse || false
  });

  const AnimatedBox = animated(as || View);

  if (onVisible) {
    return (
      <Visible
        disabled={state.active}
        onChange={visible => {
          if (visible && !state.active) {
            setState({ ...state, active: true });
          } else if (!stayVisible) {
            setState({ ...state, active: false });
          }
        }}
      >
        {({ isVisible }) => {
          if (!isVisible) return null;
          return <AnimatedBox style={aniStyle}>{children}</AnimatedBox>;
        }}
      </Visible>
    );
  }

  return <AnimatedBox style={aniStyle}>{children}</AnimatedBox>;
};

Comp.defaultProps = {
  stayVisible: true,
  from: { opacity: 0 },
  to: { opacity: 1 }
};

export default Comp;
