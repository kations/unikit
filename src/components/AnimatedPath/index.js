import React, { useMemo, useEffect } from "react";
import { Animated } from "react-native";
import { Path } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default ({ d, ...rest }) => {
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const strokeDasharray = useMemo(
    () => new svgPathProperties(d).getTotalLength(),
    [d]
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const t = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [strokeDasharray, 0],
  });

  return (
    <AnimatedPath
      {...rest}
      d={d}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={t}
    />
  );
};
