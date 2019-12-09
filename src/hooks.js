import { Dimensions, PanResponder } from "react-native";
import { useEffect, useState, useMemo } from "react";

export const useWindowDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("window"));
  useEffect(() => {
    const onChange = result => setScreenData(result.window);

    Dimensions.addEventListener("change", onChange);
    return () => Dimensions.removeEventListener("change", onChange);
  }, []);
  return {
    ...screenData,
    isLandscape: screenData.width > screenData.height,
    isLargeScreen: screenData.width > 1000
  };
};

export const useGesture = (config, state = []) => {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        ...config
      }),
    state
  );
  return panResponder.panHandlers;
};

export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
