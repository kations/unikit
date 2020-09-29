import { Dimensions, PanResponder } from "react-native";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";

export const useIsMounted = function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(function setIsMounted() {
    isMounted.current = true;

    return function cleanupSetIsMounted() {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

export const useUpdateEffect = function useUpdateEffect(effect, dependencies) {
  const isMounted = useIsMounted();
  const isInitialMount = useRef(true);

  useEffect(() => {
    let effectCleanupFunc = function noop() {};

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effectCleanupFunc = effect() || effectCleanupFunc;
    }
    return () => {
      effectCleanupFunc();
      if (!isMounted.current) {
        isInitialMount.current = true;
      }
    };
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

export const useDelay = (delay) => {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      alert(delay);
      setWaiting(false);
    }, delay);
  }, []);

  return { waiting };
};

export const useInterval = (callback, delay, ...args) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current(...args);
    }
    if (delay !== null && delay !== undefined) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const usePrevious = (value) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

export const useScaledSize = ({ multiple = 1 }) => {
  const {
    window: { width },
  } = useDimensions();
  let size = 16;

  if (width >= 1408) size = 24;
  else if (width >= 1216) size = 22;
  else if (width >= 1024) size = 20;
  else if (width >= 768) size = 18;

  return size * multiple;
};

export const useLayout = () => {
  const [layout, setLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onLayout = useCallback((e) => setLayout(e.nativeEvent.layout), []);

  return {
    onLayout,
    ...layout,
  };
};

export const useDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("window"));
  useEffect(() => {
    const onChange = (result) => setScreenData(result.window);

    Dimensions.addEventListener("change", onChange);
    return () => Dimensions.removeEventListener("change", onChange);
  }, []);
  return {
    ...screenData,
    isLandscape: screenData.width > screenData.height,
    isLargeScreen: screenData.width > 1000,
  };
};

export const useGesture = (config, state = []) => {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        ...config,
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
