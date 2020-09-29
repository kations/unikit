import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";

import styled, { useTheme } from "../styled";
import { AnimatedView, useSpring } from "../Spring";

const Checkbox = styled.TouchableOpacity(({ size, borderSize }) => ({
  width: size,
  height: size,
  borderWidth: borderSize,
  borderColor: "primary",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: size / 2,
}));

const Circle = styled(AnimatedView)(({ size, borderSize }) => ({
  width: size - borderSize * 4,
  height: size - borderSize * 4,
  backgroundColor: "primary",
  borderRadius: size / 2,
  web: {
    transitionProperty: "all",
    transitionDuration: "250ms",
  },
}));

const Comp = ({
  type = "primary",
  value,
  onChange,
  size = 26,
  style,
  borderSize = 2,
  disabled,
  ...rest
}) => {
  const theme = useTheme();
  const [active, setActive] = useState(value || false);

  const o = useSpring({
    to: active ? 1 : 0.5,
  });

  const scale = useSpring({
    to: active ? 1 : 0.0001,
  });

  useEffect(() => {
    console.log({ value, active });
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

  return (
    <Checkbox
      type={type}
      style={style}
      activeOpacity={0.8}
      size={size}
      borderSize={borderSize}
      onPress={() => {
        onPressSwitch(!active);
      }}
      {...rest}
    >
      {Platform.OS === "web" ? (
        <Circle
          size={size}
          borderSize={borderSize}
          style={{
            opacity: active ? 1 : 0,
            transform: [{ scale: active ? 1 : 0 }],
          }}
        />
      ) : (
        <Circle
          size={size}
          borderSize={borderSize}
          style={{ opacity: o, transform: [{ scale: scale }] }}
        />
      )}
    </Checkbox>
  );
};

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  size: PropTypes.number,
  borderSize: PropTypes.number,
  onChange: PropTypes.func,
};

export default Comp;
