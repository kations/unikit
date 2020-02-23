import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withThemeProps } from "../styled";
import Visible from "../Visible";
import Box from "../Box";

export function Animate({
  from = { opacity: 0, y: 100, x: 0 },
  to = { opacity: 1, y: 0, x: 0 },
  children,
  stayVisible = true,
  onVisible = false,
  isVisible = true,
  delay = 0,
  duration = 500,
  config,
  style,
  ...rest
}) {
  const [visible, setVisible] = useState(
    onVisible === false && isVisible === true ? true : false
  );

  useEffect(() => {
    console.log({ isVisible });
    setVisible(isVisible);
  }, [isVisible]);

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

  const aniStyle = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationFillMode: `forwards`,
    animationKeyframes: demo
  };

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
          onChange={vis => {
            console.log({ vis });
            setVisible(vis);
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

Animate.propTypes = {
  children: PropTypes.node,
  from: PropTypes.object,
  to: PropTypes.object,
  stayVisible: PropTypes.bool,
  onVisible: PropTypes.bool,
  isVisible: PropTypes.bool,
  delay: PropTypes.number,
  duration: PropTypes.number,
  config: PropTypes.object,
  style: PropTypes.object
};

export default withThemeProps(Animate, "Animate");
