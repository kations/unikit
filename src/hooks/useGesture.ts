import * as React from 'react';
import { PanResponder } from 'react-native';

export default function useGesture(config: object, state: [] = []) {
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => true,
        ...config,
      }),
    state
  );
  return panResponder.panHandlers;
}
