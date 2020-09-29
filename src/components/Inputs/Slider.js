import * as React from 'react';
import { scaleLinear } from 'd3-scale';

import {
  useLayout,
  useGesture,
  useUpdateEffect,
  useThrottle,
} from '../../hooks';
import { withThemeProps, createBox } from '../../restyle';
import { getProgress, getValueByProgress, isNumber } from '../../utils';
import { AnimatedView, useSpring } from '../../spring';

import Button from '../Button';
import Flex from '../Flex';
import Animate from '../Animate';
import Axis from '../Axis';

const HandleWrap = createBox(AnimatedView);

const Handle = ({
  onChange,
  onSwipe,
  value,
  prevValue,
  nextValue,
  width,
  handleSize,
  handleFactor = 1.8,
  min,
  max,
  trackColor,
  progressColor = 'primary',
  showHandle = true,
  handleFocusOpacity = 0.2,
  handleColor = 'surface',
  handleShow = 5,
  springConfig = {},
  roundness,
  zIndex,
  hideTrack,
  hideProgressTrack,
  formatValue,
  valueSize = 25,
  showValue = true,
  steps,
  trackHeight,
}) => {
  const [down, setDown] = React.useState(false);
  const [progress, setProgress] = React.useState(() =>
    getProgress(min, max, value)
  );

  const debouncedProgress = useThrottle(progress, 50);

  const prevProgress = getProgress(min, max, prevValue || min);
  const nextProgress = getProgress(min, max, nextValue || max);

  const handleWrapSize = handleSize * handleFactor;

  useUpdateEffect(() => {
    if (!down) {
      setProgress(getProgress(min, max, value));
    }
  }, [value]);

  useUpdateEffect(() => {
    if (down === false) {
      let newValue = getValueByProgress(min, max, progress);
      if ((newValue / steps) % 1 != 0) {
        newValue = Math.round(newValue / steps) * steps;
        setProgress(getProgress(min, max, newValue));
      }
      if (onChange) onChange(newValue);
    }
  }, [down]);

  useUpdateEffect(() => {
    if (onSwipe) {
      let newValue = getValueByProgress(min, max, progress);
      if ((newValue / steps) % 1 != 0) {
        newValue = Math.round(newValue / steps) * steps;
      }
      onSwipe(newValue);
    }
  }, [debouncedProgress]);

  const x = useSpring({
    to: progress * width,
    immediate: down,
    config: springConfig,
  });

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
        let newProgress = getProgress(0, width, progress * width + dx);
        if (newProgress < 0) {
          newProgress = 0;
        } else if (newProgress > 1) {
          newProgress = 1;
        }
        if (prevProgress > 0 && newProgress <= prevProgress) {
          newProgress = prevProgress;
        }
        if (nextProgress < 1 && newProgress >= nextProgress) {
          newProgress = nextProgress;
        }
        setProgress(newProgress);
      },
      onPanResponderRelease: (e, { vx, vy }) => {
        setDown(false);
      },
    },
    [down]
  );

  return (
    <HandleWrap
      position="absolute"
      left={0}
      top={trackHeight / 2 - handleWrapSize / 2}
      right={0}
      justifyContent="center"
      overflow="visible"
      style={{
        width: '100%',
        height: handleWrapSize,
        zIndex,
      }}
      pointerEvents="box-none"
    >
      {!hideProgressTrack && (
        <HandleWrap
          bg={hideTrack ? trackColor : progressColor}
          borderRadius={roundness}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            marginTop: -trackHeight / 2,
            width: x,
            height: trackHeight,
          }}
          pointerEvents="none"
        />
      )}
      <HandleWrap
        width={handleWrapSize}
        height={handleWrapSize}
        ml={-(handleWrapSize / 2)}
        position="relative"
        flexCenter
        style={{
          transform: [{ translateX: x }],
        }}
        webStyle={{
          cursor: 'grab',
        }}
        {...bindGesture}
      >
        <Animate
          isVisible={down}
          from={{ s: 0 }}
          to={{ s: 1 }}
          borderRadius={handleWrapSize / 2}
          absoluteFill
          bg={`primary:setAlpha:${handleFocusOpacity}`}
        />
        <Flex
          bg={showHandle ? handleColor : 'transparent'}
          borderRadius={handleSize}
          borderWidth={showHandle ? 1 : 0}
          borderColor="text:setAlpha:0.05"
          width={handleSize}
          height={handleSize}
          shadow={showHandle ? handleShow : 0}
          flexCenter
        >
          {showValue && (
            <Animate
              isVisible={down}
              from={{ y: 10, o: 0 }}
              to={{ y: 0, o: 1 }}
              position="absolute"
              left={-100}
              right={-100}
              top={-valueSize * 1.2}
              flexCenter
            >
              <Button
                bg={progressColor}
                size={valueSize}
                rounded
                webStyle={{ userSelect: 'none' }}
              >
                {formatValue
                  ? `${formatValue(
                      getValueByProgress(min, max, progress).toFixed(
                        steps < 1 ? 2 : 0
                      )
                    )}`
                  : `${getValueByProgress(min, max, progress).toFixed(
                      steps < 1 ? 2 : 0
                    )}`}
              </Button>
            </Animate>
          )}
        </Flex>
      </HandleWrap>
    </HandleWrap>
  );
};

const Ticks = ({ steps, min, max, width, formatTick, ...rest }) => {
  const scaleX = React.useMemo(
    () => scaleLinear().domain([min, max]).range([0, width, 0.5]),
    [steps, min, max, width]
  );

  return (
    <Axis
      orient="BOTTOM"
      scale={scaleX}
      ticks={steps !== 1 ? Math.round(max / steps) : undefined}
      tickFormat={(d) => {
        return formatTick ? formatTick(d) : `${d}`;
      }}
      {...rest}
    />
  );
};

const Slider = ({
  theme,
  value = 0,
  onChange,
  trackColor = 'input',
  trackHeight = 10,
  handleSize = 30,
  showHandle = true,
  min = 0,
  max = 100,
  steps = 1,
  showValue = true,
  panValue = false,
  showTicks = true,
  ticks,
  tickGap = 5,
  vertical = false,
  minDistance = 5,
  handleProps = {},
  springConfig = {},
  renderTrack = null,
  roundness,
  formatTick,
  hideProgressTrack,
  ...rest
}) => {
  const { onLayout, width } = useLayout();
  const [values, setValues] = React.useState(() =>
    Array.isArray(value) ? value : [value || 0]
  );
  const borderRadius = isNumber(roundness)
    ? roundness
    : theme.globals.roundness;

  React.useEffect(() => {
    const newValues = Array.isArray(value) ? value : [value || 0];
    if (newValues !== values) setValues(newValues);
  }, [value]);

  return (
    <Flex
      width="100%"
      px={showHandle ? handleSize / 2 : 0}
      pb={showHandle ? handleSize / 2 : 0}
      pt={showHandle ? handleSize / 2 : 0}
      {...rest}
    >
      <Flex width="100%" position="relative">
        <Flex
          onLayout={onLayout}
          bg={trackColor}
          width="100%"
          height={trackHeight}
          borderRadius={borderRadius}
          overflow="hidden"
        >
          {renderTrack}
        </Flex>
        {width > 0 &&
          values.map((v, i) => {
            return (
              <Handle
                key={`handle-${i}`}
                prevValue={values[i - 1] ? values[i - 1] + steps : undefined}
                nextValue={values[i + 1] ? values[i + 1] - steps : undefined}
                value={v}
                showValue={showValue}
                handleSize={handleSize}
                min={min}
                max={max}
                roundness={borderRadius}
                trackColor={trackColor}
                trackHeight={trackHeight}
                showHandle={showHandle}
                hideTrack={values.length > 1 && i === 0}
                hideProgressTrack={hideProgressTrack}
                steps={steps}
                onChange={(v) => {
                  if (onChange) {
                    if (Array.isArray(value)) {
                      const newValue = [...value];
                      newValue[i] = v;
                      setValues(newValue);
                      onChange(newValue);
                    } else {
                      onChange(v);
                    }
                  }
                }}
                {...rest}
                zIndex={999 - i}
                width={width}
              />
            );
          })}
      </Flex>
      {showTicks && width > 0 && (
        <Ticks
          width={width}
          steps={steps}
          min={min}
          max={max}
          padding={handleSize * 0.4}
          formatTick={formatTick}
        />
      )}
    </Flex>
  );
};

export default withThemeProps(Slider, 'Slider');
