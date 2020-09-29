import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Platform } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import styled, { useTheme } from "../styled";
import { useGesture, useUpdateEffect } from "../hooks";

import {
  AnimatedTouchable,
  AnimatedView,
  intColor,
  useSpring,
} from "../Spring";

const Switch = styled(AnimatedTouchable)(({ size, radius, gap }) => ({
  position: "relative",
  display: Platform.OS === "web" ? "inline-block" : "flex",
  overflow: "hidden",
  height: size,
  padding: gap,
  borderRadius: radius || size,
  margin: 0,
  web: {
    cursor: "pointer",
    transitionProperty: "all",
    transitionDuration: "250ms",
  },
}));

const Track = styled.View({
  position: "relative",
  width: "100%",
  height: "100%",
});

const Touchable = styled.TouchableOpacity({
  absoluteFill: true,
  web: {
    cursor: "grab",
  },
});

const Circle = styled(AnimatedView)(({ size, radius, gap }) => ({
  position: "absolute",
  top: 0,
  width: size - gap * 2,
  height: size - gap * 2,
  borderRadius: radius ? radius - gap / 2 : size,
  backgroundColor: "#fff",
  web: {
    cursor: "grab",
  },
}));

const Comp = ({
  value,
  onChange,
  size = 40,
  radius,
  gap = 5,
  style,
  trackColor = "background",
  activeTrackColor = "primary",
  disabled,
  ...rest
}) => {
  const theme = useTheme();

  const TRACK_WIDTH = size * 2 - gap;
  const LEFT = size - gap;
  const ACTIVE_COLOR = theme.colors[activeTrackColor] || activeTrackColor;
  const COLOR = theme.colors[trackColor] || trackColor;

  const [down, setDown] = useState(false);
  const [active, setActive] = useState(value || false);
  const [move, setMove] = useState(active ? LEFT : 0.0001);

  const x = useSpring({
    to: move,
    immediate: down,
  });

  useUpdateEffect(() => {
    setMove(active ? LEFT : 0.0001);
  }, [active]);

  useUpdateEffect(() => {
    if (down === false) {
      const newActive = disabled ? active : move > LEFT / 2;
      setMove(newActive ? LEFT : 0.0001);
      setActive(newActive);
      setTimeout(() => {
        if (onChange) onChange(newActive);
      }, 10);
    }
  }, [down]);

  const bindGesture = useGesture(
    {
      onMoveShouldSetPanResponderCapture: (e, { dy, dx }) => {
        const allow = Math.abs(dx) > 5;
        return allow;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e, { dy, dx }) => {
        setDown(true);
      },
      onPanResponderMove: (e, { dy, dx }) => {
        let newMove = move + dx;
        if (newMove < 0) {
          newMove = 0;
        } else if (newMove > LEFT) {
          newMove = LEFT;
        }

        setMove(newMove);
      },
      onPanResponderRelease: (e, { vx, vy }) => {
        setDown(false);
      },
    },
    [move, down]
  );

  // const backgroundColor = useColorAnimation({
  //   value: active
  //     ? theme.colors[activeTrackColor] || activeTrackColor
  //     : theme.colors[trackColor] || trackColor,
  //   aniValue: x,
  //   range: [0, LEFT]
  // });

  const backgroundColor = intColor(x, {
    color: active ? ACTIVE_COLOR : COLOR,
    inputRange: [0, LEFT],
    outputRange: [COLOR, ACTIVE_COLOR],
  });

  useEffect(() => {
    if (value !== active) setActive(value);
  }, [value]);

  const onPressSwitch = (newActive) => {
    if (disabled) return false;
    setActive(newActive);
    setTimeout(() => {
      if (onChange) onChange(newActive);
    }, 10);
    if (theme.onFeedback) theme.onFeedback("success");
  };

  // TODO: add hover effect
  // onMouseEnter={() => console.log("hover")}
  // onMouseLeave={() => }

  return (
    <Switch
      style={{
        ...style,
        width: TRACK_WIDTH,
        backgroundColor: backgroundColor,
      }}
      activeOpacity={0.8}
      size={size}
      radius={radius}
      gap={gap}
      onPress={() => {
        onPressSwitch(!active);
      }}
      {...rest}
    >
      <Track>
        <Circle
          style={{
            transform: [{ translateX: x }],
          }}
          size={size}
          radius={radius}
          gap={gap}
          shadow={5}
          {...bindGesture}
        >
          <Touchable
            onPress={() => {
              onPressSwitch(!active);
            }}
          />
        </Circle>
      </Track>
    </Switch>
  );
};

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  circleSize: PropTypes.number,
  borderSize: PropTypes.number,
  onChange: PropTypes.func,
};

export default Comp;
