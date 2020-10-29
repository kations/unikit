// Massive respect for Josh Johnston
// A lot of the logic is taken from his repo -> https://github.com/joshwnj/react-visibility-sensor
// And is rewritten for hooks api

import { useEffect, useReducer, useLayoutEffect, useRef } from 'react';
import { Dimensions } from 'react-native';

import useInterval from './useInterval';

const initialState = { isVisible: null, visibilityRect: {} };

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      if (state.isVisible === action.payload.isVisible) {
        return state;
      }
      return action.payload;
    default:
      return state;
  }
}

function useVisbilitySensor({
  onChange,
  interval = 100,
  disabled = false,
  stayVisible = true,
  partialVisibility = false,
}) {
  const [localState, dispatch] = useReducer(reducer, initialState);
  const ref = useRef(null);

  function checkVisibility() {
    ref.current.measure((x, y, width, height, pageX, pageY) => {
      const rect = {
        width,
        height,
        left: pageX,
        top: pageY,
        right: pageX + width,
        bottom: pageY + height,
      };

      let containmentRect = {
        top: 0,
        left: 0,
        bottom: Dimensions.get('window').height,
        right: Dimensions.get('window').width,
      };

      const hasSize = rect.height > 0 || rect.width > 0;

      const visibilityRect = {
        top: rect.top >= containmentRect.top,
        left: rect.left >= containmentRect.left,
        bottom: rect.bottom <= containmentRect.bottom,
        right: rect.right <= containmentRect.right,
      };

      let isVisible =
        hasSize &&
        visibilityRect.top &&
        visibilityRect.left &&
        visibilityRect.bottom &&
        visibilityRect.right;

      // check for partial visibility
      if (hasSize && partialVisibility) {
        let partialVisible =
          rect.top <= containmentRect.bottom &&
          rect.bottom >= containmentRect.top &&
          rect.left <= containmentRect.right &&
          rect.right >= containmentRect.left;

        // account for partial visibility on a single edge
        if (typeof partialVisibility === 'string') {
          partialVisible = visibilityRect[partialVisibility];
        }

        // if we have minimum top visibility set by props, lets check, if it meets the passed value
        // so if for instance element is at least 200px in viewport, then show it.
        isVisible = minTopValue
          ? partialVisible && rect.top <= containmentRect.bottom - minTopValue
          : partialVisible;
      }
      dispatch({
        type: 'set',
        payload: { isVisible, visibilityRect },
      });
      if (onChange) onChange(isVisible);
    });
  }

  function updateIsVisible() {
    if (!ref.current) {
      return;
    }
    checkVisibility();
  }

  useEffect(() => {
    if (ref.current) {
      updateIsVisible();
    }
  }, [ref.current]);

  // If interval check is needed
  useInterval(
    () => {
      updateIsVisible();
    },
    disabled ||
      (localState.isVisible && stayVisible) ||
      localState.isVisible === null
      ? null
      : interval
  );

  return { bindVisibility: { ref }, ...localState };
}

export default useVisbilitySensor;
