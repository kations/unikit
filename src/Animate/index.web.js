import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withThemeProps } from "../styled";
import Visible from "../Visible";
import Box from "../Box";
import { useUpdateEffect } from "../hooks";

const cleanKeys = keys => {
  const transformKeys = {};
  transformKeys["transform"] = [];
  if (keys.y !== undefined) {
    transformKeys["transform"].push({ translateY: keys.y });
  }
  if (keys.x !== undefined) {
    transformKeys["transform"].push({ translateX: keys.x });
  }
  if (keys.o !== undefined) {
    transformKeys["opacity"] = keys.o;
  }
  return transformKeys;
};

const Animate = withThemeProps(
  ({
    from = { o: 0, y: 100, x: 0 },
    to = { o: 1, y: 0, x: 0 },
    children,
    stayVisible = true,
    onVisible,
    isVisible = true,
    delay = 0,
    duration = 500,
    offset = 0,
    config,
    style,
    useTransition = false,
    ...rest
  }) => {
    const [reverse, setReverse] = useState(false);
    const [visible, setVisible] = useState(
      onVisible || delay !== 0 ? false : isVisible
    );

    config = {
      easing: "easeInOutBack",
      ...config
    };

    useEffect(() => {
      if (isVisible && delay) {
        setTimeout(() => {
          setVisible(true);
        }, delay);
      }
    }, []);

    useUpdateEffect(() => {
      setVisible(isVisible);
    }, [isVisible]);

    useEffect(() => {
      if (visible === true && reverse === false) {
        setTimeout(() => {
          setReverse(true);
        }, duration);
      }
    }, [visible]);

    const fromKeys = cleanKeys(from);
    const toKeys = cleanKeys(to);

    const demo = {
      "0%": fromKeys,
      "100%": toKeys
    };

    const demoRev = {
      "0%": toKeys,
      "100%": fromKeys
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

    const styling = useTransition
      ? {
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: config.easing,
          transitionProperty: ["opacity", "transform"],
          ...(visible ? toKeys : fromKeys)
        }
      : {
          ...style,
          ...demo["0%"],
          animationFillMode: `both`,
          animationTimingFunction: config.easing,
          ...((!visible && onVisible) || isVisible === false ? {} : aniStyle),
          ...(reverse && !visible ? aniStyleRev : {})
        };

    const AnimatedComp = (
      <Box style={styling} {...rest}>
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
              return <div />;
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

Animate.defaultPropTypes = {
  from: { o: 0, y: 100, x: 0 },
  to: { o: 1, y: 0, x: 0 },
  stayVisible: true,
  isVisible: true
};

export default Animate;
