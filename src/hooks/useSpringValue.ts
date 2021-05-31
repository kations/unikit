import { useSharedValue } from 'react-native-reanimated';
import { useRef } from 'react';

const fallback = () => ({});

export default function useDynamicAnimation(initialState = fallback) {
  const activeStyle = useRef({
    value: null,
  });
  if (activeStyle.current.value === null) {
    // use a .value to be certain it's never been set
    activeStyle.current.value = initialState;
  }

  const __state = useSharedValue(activeStyle.current.value);

  const controller = useRef();

  if (controller.current == null) {
    controller.current = {
      __state,
      get current() {
        return __state.value;
      },
      animateTo(nextStateOrFunction) {
        'worklet';

        const nextStyle =
          typeof nextStateOrFunction === 'function'
            ? nextStateOrFunction(__state.value)
            : nextStateOrFunction;

        __state.value = nextStyle;
      },
    };
  }

  return controller.current;
}
