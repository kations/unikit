import React, { Fragment, useState, useEffect } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";
import Visible from "../Visible";

import { Animated, useSpring } from "../Spring";
import { useUpdateEffect } from "../hooks";

const Box = styled(Animated.View)();

const getValue = (obj, key, defaultValue) => {
  return obj[key] !== undefined ? obj[key] : defaultValue;
};

const Animate = withThemeProps(
  ({
    from = { o: 0, y: 100, x: 0 },
    to = { o: 1, y: 0, x: 0 },
    children,
    stayVisible = true,
    onVisible,
    isVisible = true,
    delay,
    duration,
    config,
    style,
    ...rest
  }) => {
    const [visible, setVisible] = useState(false);

    const x = useSpring({
      to: visible ? getValue(to, "x", 0) : getValue(from, "x", 0),
      config,
    });
    const y = useSpring({
      to: visible ? getValue(to, "y", 0) : getValue(from, "y", 0),
      config,
    });

    const s = useSpring({
      to: visible ? getValue(to, "s", 1) : getValue(from, "s", 1),
      config,
    });

    const o = useSpring({
      to: visible ? getValue(to, "o", 0) : getValue(from, "o", 0),
      config,
    });

    useEffect(() => {
      if (isVisible && !onVisible) {
        if (delay) {
          setTimeout(() => {
            setVisible(true);
          }, delay);
        } else {
          setVisible(true);
        }
      }
    }, []);

    useUpdateEffect(() => {
      setVisible(isVisible);
    }, [isVisible]);

    const opacity = getValue(from, "o") !== undefined ? o : 1;
    const transform = [];

    if (getValue(from, "y") !== undefined) {
      transform.push({ translateY: y });
    }
    if (getValue(from, "x") !== undefined) {
      transform.push({ translateX: x });
    }
    if (getValue(from, "s") !== undefined) {
      transform.push({ translateX: s });
    }

    const AnimatedComp = (
      <Box
        style={{
          ...style,
          opacity,
          transform,
        }}
        pointerEvents={visible ? "auto" : "none"}
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
            onChange={(isVisible) => {
              setVisible(isVisible);
            }}
            offset={100}
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
  style: PropTypes.object,
};

Animate.defaultPropTypes = {
  from: { o: 0, y: 100, x: 0 },
  to: { o: 1, y: 0, x: 0 },
  stayVisible: true,
  isVisible: true,
};

export default Animate;
