import React, { Fragment, useState } from "react";

import Visible from "../Visible";
import Box from "../Box";

export default function Animate(props) {
  const {
    from = { opacity: 0, y: 100, x: 0 },
    to = { opacity: 1, y: 0, x: 0 },
    children,
    stayVisible = true,
    onVisible,
    isVisible,
    delay = 0,
    duration = 500,
    reset,
    reverse,
    config,
    style,
    ...rest
  } = props;

  const [visible, setVisible] = useState(
    !onVisible && !isVisible ? true : false
  );

  const cleanKeys = keys => {
    if (keys.x !== undefined || keys.y !== undefined) {
      keys["transform"] = `translate3d(${keys.x || 0}px, ${keys.y || 0}px, 0)`;
      delete keys["x"];
      delete keys["y"];
    }
    return keys;
  };

  const demo = {
    "0%": cleanKeys(from),
    "100%": cleanKeys(to)
  };

  console.log({ demo });

  const aniStyle = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationFillMode: `forwards`,
    animationKeyframes: demo
  };

  console.log(demo["0%"]);

  const AnimatedComp = (
    <Box
      style={{
        ...style,
        ...demo["0%"],
        ...(visible ? aniStyle : {})
      }}
      {...rest}
    >
      {children}
    </Box>
  );

  if (onVisible) {
    return (
      <Fragment>
        <Visible
          disabled={visible && stayVisible}
          onChange={isVisible => {
            setVisible(isVisible);
          }}
          offset={100}
        >
          {({ isVisible }) => {
            return <Box />;
          }}
        </Visible>
        {AnimatedComp}
      </Fragment>
    );
  }

  return AnimatedComp;
}
