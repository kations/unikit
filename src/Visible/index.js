import React, { useRef, useState } from "react";
import { View } from "react-native";
import { useDimensions, useInterval } from "../hooks";

function Visible({
  children,
  offset = 0,
  delay = 100,
  stayVisible = true,
  disabled,
  onChange,
  ...rest
}) {
  const [rect, setRect] = useState({ top: 0, bottom: 0 });
  const [visible, setVisible] = useState(false);
  const dimensions = useDimensions();
  const compRef = useRef(null);

  // const isInViewPort = () => {
  //   const isVisible =
  //     rect.bottom !== 0 && rect.top >= 0 && rect.bottom <= dimensions.height;
  //   if (visible !== isVisible) {
  //     setVisible(isVisible);
  //     if (onChange) onChange(isVisible);
  //   }
  // };

  useInterval(
    () => {
      if (compRef && compRef.current) {
        compRef.current.measure((x, y, width, height, pageX, pageY) => {
          const t = pageY + offset;
          const b = pageY + height + offset;
          const w = pageX + width;
          const isVisible = b !== 0 && t >= 0 && b <= dimensions.height;
          if (visible !== isVisible) {
            setVisible(isVisible);
            if (onChange) onChange(isVisible);
          }
        });
      }
    },
    disabled || (visible && stayVisible) ? null : delay
  );

  return (
    <View collapsable={false} ref={compRef} {...rest}>
      {children instanceof Function
        ? children({
            isVisible: visible
          })
        : children}
    </View>
  );
}

export default Visible;
