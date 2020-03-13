import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import { withThemeProps } from "../styled";
import Visible from "../Visible";
import Box from "../Box";

const cleanKeys = keys => {
  if (keys.x !== undefined || keys.y !== undefined) {
    keys["transform"] = `translate3d(${keys.x || 0}px, ${keys.y || 0}px, 0)`;
    delete keys["x"];
    delete keys["y"];
  }
  return keys;
};

const Animate = withThemeProps(
  ({
    from = { opacity: 0, y: 100, x: 0 },
    to = { opacity: 1, y: 0, x: 0 },
    children,
    stayVisible = true,
    onVisible,
    isVisible = true,
    delay = 0,
    duration = 500,
    offset = 0,
    config,
    style,
    ...rest
  }) => {
    const [reverse, setReverse] = useState(false);
    const [visible, setVisible] = useState(onVisible ? false : isVisible);

    useEffect(() => {
      if (reverse === true) {
        setVisible(isVisible);
      }
    }, [isVisible]);

    useEffect(() => {
      if (visible === true && reverse === false) {
        setTimeout(() => {
          setReverse(true);
        }, duration);
      }
    }, [visible]);

    const demo = {
      "0%": cleanKeys(from),
      "100%": cleanKeys(to)
    };

    const demoRev = {
      "0%": cleanKeys(to),
      "100%": cleanKeys(from)
    };

    const aniStyle = {
      animationDelay: `${delay}ms`,
      animationDuration: `${duration}ms`,
      animationKeyframes: demo
    };

    const aniStyleRev = {
      animationDelay: `0ms`,
      animationDuration: `${duration}ms`,
      animationKeyframes: demoRev
    };

    const AnimatedComp = (
      <Box
        style={{
          ...style,
          ...demo["0%"],
          animationFillMode: `forwards`,
          ...((!visible && onVisible) || isVisible === false ? {} : aniStyle),
          ...(reverse && !visible ? aniStyleRev : {})
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
            stayVisible={stayVisible}
            onChange={vis => {
              setVisible(vis);
            }}
            offset={offset}
          >
            {({ isVisible }) => {
              return <View />;
            }}
          </Visible>
          {AnimatedComp}
        </Fragment>
      );
    }

    return AnimatedComp;
  },
  "Animate"
);

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

Animate.defaultProps = {
  from: { opacity: 0, y: 100, x: 0 },
  to: { opacity: 1, y: 0, x: 0 },
  stayVisible: true,
  isVisible: true
};

export default Animate;
