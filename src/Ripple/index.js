import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import tc from "tinycolor2";

import styled, { useTheme } from "../styled";
import Animate from "../Animate";

const Touchable = styled.TouchableOpacity(({ overflow }) => ({
  position: "relative",
  overflow: overflow ? "visible" : "hidden",
}));

const Ripple = ({ timeout, setItems, key, size, ...rest }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setItems((state) => state.filter((i) => i.key !== key));
      }, 500);
    }, timeout);
  }, []);

  return (
    <Animate
      w={size}
      h={size}
      borderRadius={size / 2}
      from={{ s: 1, o: 1 }}
      to={{ s: 2, o: 1 }}
      w="auto"
      isVisible={visible}
      absolute
      {...rest}
    />
  );
};

export default function Button({
  children,
  onPress,
  size = 50,
  rippleColor = "#000",
  overflow = false,
  ...rest
}) {
  const [items, setItems] = useState([]);
  const theme = useTheme();

  return (
    <Touchable
      onPress={(e) => {
        let { locationX, locationY } = e.nativeEvent;
        if (onPress) onPress();
        console.log({ locationX, locationY, evt: e.nativeEvent });
        setItems([...items, { locationX, locationY }]);
      }}
      {...rest}
      overflow={!overflow ? "hidden" : undefined}
      activeOpacity={1}
      pointerEvents="box-only"
    >
      {children}
      {items.map((item, index) => (
        <Ripple
          key={`ripple-${item.key}`}
          size={size}
          setItems={setItems}
          timeout={5000}
          bg={tc(theme.colors[rippleColor] || rippleColor)
            .darken(5)
            .toString()}
          style={{
            left: item ? item.locationX - size / 2 : 0,
            top: item ? item.locationY - size / 2 : 0,
          }}
          pointerEvents="none"
        />
      ))}
      {/* {transitions.map(({ item, props, key }) => (
        <Ripple
          key={`ripple-${key}`}
          size={size}
          bg={tc(theme.colors[rippleColor] || rippleColor)
            .darken(5)
            .toString()}
          style={{
            left: item ? item.locationX - size / 2 : 0,
            top: item ? item.locationY - size / 2 : 0,
            opacity: props.opacity,
            transform: props.scale.interpolate(s => [{ scale: s }])
          }}
          pointerEvents="none"
        />
      ))} */}
    </Touchable>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  rippleColor: PropTypes.string,
  size: PropTypes.number,
  overflow: PropTypes.bool,
};
