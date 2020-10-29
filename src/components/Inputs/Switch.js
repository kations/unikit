import React, { useState, useEffect } from 'react';
import { useTheme, styled } from '../../restyle';
import { useGesture, useUpdateEffect } from '../../hooks';

import { AnimatedTouchable, AnimatedView, useSpring } from '../../spring';

import Flex from '../Flex';
import Touchable from '../Touchable';
import { isNumber, getProgress } from '../../utils';

const Switch = styled(AnimatedTouchable)();
const Circle = styled(AnimatedView)();
const Bg = styled(AnimatedView)();

const Comp = ({
  value,
  onChange,
  size = 35,
  roundness,
  gap = 5,
  style,
  trackColor = 'input',
  activeTrackColor = 'primary',
  handleShow = 5,
  disabled,
  ...rest
}) => {
  const theme = useTheme();

  const TRACK_WIDTH = size * 2 - gap;
  const LEFT = size - gap;

  const [down, setDown] = useState(false);
  const [progress, setProgress] = useState(value ? 1 : 0);

  const setValue = (s) => {
    if (disabled) return false;
    const newProgress = progress < 0.5 ? (s ? 1 : 0) : s ? 0 : 1;
    setProgress(newProgress);
    setTimeout(() => {
      if (onChange) onChange(newProgress > 0);
    }, 10);
    if (theme.onFeedback) theme.onFeedback('success');
  };

  const x = useSpring({
    to: progress * LEFT,
    immediate: down,
  });

  const opacity = useSpring({
    to: progress,
    immediate: down,
  });

  useUpdateEffect(() => {
    if (down === false) {
      setValue();
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
        let newProgress = getProgress(0, LEFT, progress * LEFT + dx);
        if (newProgress < 0) {
          newProgress = 0;
        } else if (newProgress > 1) {
          newProgress = 1;
        }
        setProgress(newProgress);
      },
      onPanResponderRelease: (e, { vx, vy }) => {
        setDown(false);
      },
    },
    [down]
  );

  useEffect(() => {
    if (value && progress === 0) {
      setProgress(1);
    } else if (!value && progress === 1) {
      setProgress(0);
    }
  }, [value]);

  return (
    <Switch
      style={{
        ...style,
        width: TRACK_WIDTH,
      }}
      bg={trackColor}
      position="relative"
      activeOpacity={0.8}
      height={size}
      p={gap}
      borderRadius={isNumber(roundness) ? roundness : size}
      onPress={() => {
        setValue(true);
      }}
      webStyle={{
        cursor: 'pointer',
      }}
      {...rest}
    >
      <Bg
        bg={activeTrackColor}
        borderRadius={isNumber(roundness) ? roundness : size}
        style={{ opacity }}
        absoluteFill
        pointerEvents="none"
        zIndex={0}
      />
      <Flex position="relative" height="100%">
        <Circle
          style={{
            transform: [{ translateX: x }],
          }}
          shadow={handleShow}
          position="absolute"
          top={0}
          width={size - gap * 2}
          height={size - gap * 2}
          borderRadius={isNumber(roundness) ? roundness - gap / 2 : size}
          borderWidth={1}
          borderColor="text:setAlpha:0.05"
          bg="surface"
          {...bindGesture}
        >
          <Touchable
            onPress={() => {
              setValue(true);
            }}
            width={size - gap * 2}
            height={size - gap * 2}
            webStyle={{
              cursor: 'grab',
            }}
          />
        </Circle>
      </Flex>
    </Switch>
  );
};

export default Comp;
