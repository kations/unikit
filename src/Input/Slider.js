import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";

import { useLayout, useGesture, useUpdateEffect } from "../hooks";
import styled, { withThemeProps, useTheme } from "../styled";
import { getProgress, getValueByProgress } from "../util";
import Button from "../Button";
import { AnimatedView, useSpring } from "../Spring";

const Wrap = styled.View();
const TrackWrap = styled.View();
const TicksWrap = styled.View({ web: { userSelect: "none" } });
const TickWrap = styled.View();
const Tick = styled.Text();
const Track = styled.View();
const TrackProgress = styled(AnimatedView)();
const Value = styled.View();
const Handle = styled.View();
const HandleWrap = styled(AnimatedView)({
  web: {
    cursor: "grab",
  },
});

const getTicks = ({ min, max, ticks, size, handleSize }) => {
  const arr = [min];
  if ((max / ticks) * handleSize > size) ticks = ticks * 2;
  let last = min + ticks;
  while (last < max) {
    arr.push(last);
    last = last + ticks;
  }
  arr.push(max);
  return arr;
};

const HandleComp = ({
  progress,
  setProgress,
  down,
  setDown,
  size,
  progressColor = "primary",
  valueSize = 28,
  valueGap = 5,
  showHandle = true,
  handleSize = 30,
  handleFactor,
  handleFocusOpacity = 0.2,
  handleColor = "#FFF",
  min = 0,
  max = 100,
  steps = 1,
  showValue = false,
  panValue,
  formatValue,
  vertical = false,
  minDistance = 5,
  handleProps = {},
  springConfig = {},
}) => {
  const [handleDown, setHandleDown] = useState(false);
  const dist = useSpring({
    to: progress * size,
    immediate: down,
    config: springConfig,
  });

  useUpdateEffect(() => {
    if (handleDown === false) {
      let newValue = getValueByProgress(min, max, progress);
      if ((newValue / steps) % 1 != 0) {
        newValue = Math.round(newValue / steps) * steps;
      }
      setProgress(getProgress(min, max, newValue), false);
    }
  }, [handleDown]);

  const gestureConfig = {
    onMoveShouldSetPanResponderCapture: (e, { dy, dx }) => {
      const allow = Math.abs(vertical ? dy : dx) > minDistance;
      return allow;
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (e, { dy, dx }) => {
      setDown(true);
      setHandleDown(true);
    },
    onPanResponderMove: (e, { dy, dx }) => {
      const dist = vertical ? dy : dx;
      console.log({ dist });
      const currentPosition = progress * size + dist;
      let newProgress = getProgress(0, size, currentPosition);
      if (newProgress < 0) {
        newProgress = 0;
      } else if (newProgress > 1) {
        newProgress = 1;
      }

      setProgress(newProgress);
    },
    onPanResponderRelease: (e, { vx, vy }) => {
      setHandleDown(false);
    },
  };

  const bindGesture = useGesture(gestureConfig, [size, down]);
  const bindGestureValue = useGesture(gestureConfig, [size, down]);

  const leftAlign = -(
    (handleSize * handleFactor - (vertical ? handleSize : 0)) /
    2
  );
  const topAlign = -(
    (handleSize * handleFactor - (vertical ? 0 : handleSize)) /
    2
  );

  return (
    <HandleWrap
      l={leftAlign}
      t={topAlign}
      bg="primary"
      bgAlpha={handleDown ? handleFocusOpacity : 0}
      absolute
      w={handleSize * handleFactor}
      h={handleSize * handleFactor}
      borderRadius={(handleSize * handleFactor) / 2}
      style={{
        transform: vertical ? [{ translateY: dist }] : [{ translateX: dist }],
      }}
      {...bindGesture}
      flexCenter
    >
      <Handle
        w={handleSize}
        h={handleSize}
        bg={handleColor}
        borderRadius={handleSize / 2}
        shadow={showHandle ? 5 : 0}
        borderWidth={showHandle ? 1 : 0}
        borderColor="text"
        borderColorAlpha={0.05}
        flexCenter
        {...handleProps}
      >
        {showValue === true || (showValue === "onDown" && down) ? (
          <Value
            b={handleSize + valueGap}
            pointerEvents={panValue ? "auto" : "none"}
            flexCenter
            minWidth={100}
            {...(panValue ? bindGestureValue : {})}
          >
            <Button bg={progressColor} size={valueSize} rounded>
              {formatValue
                ? `${formatValue(
                    Math.round(getValueByProgress(min, max, progress))
                  )}`
                : `${Math.round(getValueByProgress(min, max, progress))}`}
            </Button>
          </Value>
        ) : null}
      </Handle>
    </HandleWrap>
  );
};

const getProgressByValue = ({ value, min, max }) => {
  const valueArray = [];
  value.map((v) => {
    valueArray.push(getProgress(min, max, v));
  });
  return valueArray;
};

const getValuesByProgress = ({ progress, min, max }) => {
  const valueArray = [];
  progress.map((p) => {
    valueArray.push(getValueByProgress(min, max, p));
  });
  return valueArray.length > 1 ? valueArray : valueArray[0];
};

const Slider = withThemeProps((props) => {
  const {
    onChange,
    onSwipe,
    progressColor = "primary",
    trackColor = "input",
    trackHeight = 10,
    valueSize = 28,
    valueGap = 5,
    showHandle = true,
    handleSize = 30,
    handleFactor = 2,
    handleFocusOpacity = 0.2,
    handleColor = "#FFF",
    min = 0,
    max = 100,
    steps = 1,
    showValue = false,
    panValue = false,
    formatValue,
    showTicks = true,
    ticks,
    tickGap = 5,
    vertical = false,
    minDistance = 5,
    handleProps = {},
    springConfig = {},
    renderTrack,
    ...rest
  } = props;
  const value = Array.isArray(props.value) ? props.value : [props.value];
  const theme = useTheme();
  const [down, setDown] = useState(false);
  const [progress, setProgress] = useState(() =>
    getProgressByValue({ value, min, max })
  );
  const { onLayout, width, height } = useLayout();
  const size = vertical ? height : width;

  const dist = useSpring({
    to:
      value.length > 1
        ? progress[progress.length - 1] * size - progress[0] * size
        : progress[0] * size,

    immediate: down,
    config: springConfig,
  });

  const left = useSpring({
    to: value.length > 1 ? progress[0] * size : 0,
    immediate: down,
    config: springConfig,
  });

  useUpdateEffect(() => {
    if (!down) {
      setProgress(getProgressByValue({ value, min, max }));
    }
  }, [props.value]);

  useUpdateEffect(() => {
    if (down === false) {
      const newValue = getValuesByProgress({ progress, min, max });
      if (onChange) onChange(newValue);
    }
  }, [down]);

  const handlePadding = showHandle ? handleSize / 2 : 0;

  return (
    <Wrap
      w={vertical ? "auto" : "100%"}
      h={vertical ? "100%" : "auto"}
      pl={!vertical ? handlePadding : 0}
      pr={!vertical ? handlePadding : 0}
      pt={!vertical && showValue ? handlePadding : 0}
      pb={!vertical && showTicks ? handlePadding : 0}
      relative
      row={vertical}
      {...rest}
    >
      <TrackWrap
        relative
        flexCenter
        w={vertical ? handleSize : "100%"}
        h={vertical ? "100%" : handleSize}
        onLayout={onLayout}
      >
        <Track
          w={vertical ? trackHeight : "100%"}
          h={vertical ? "100%" : trackHeight}
          bg={trackColor}
          borderRadius={theme.globals.roundness}
          overflow="hidden"
        >
          {renderTrack ? (
            renderTrack(progress)
          ) : (
            <TrackProgress
              w={vertical ? trackHeight : "0%"}
              h={vertical ? "0%" : trackHeight}
              bg={progressColor}
              borderRadius={theme.globals.roundness}
              style={{
                width: vertical ? "100%" : dist,
                height: !vertical ? "100%" : dist,
                transform: vertical
                  ? [{ translateY: left }]
                  : [{ translateX: left }],
              }}
            />
          )}
        </Track>
        {value.map((v, i) => {
          return (
            <HandleComp
              key={`handle-${i}`}
              progress={progress[i]}
              panValue={panValue}
              handleFactor={handleFactor}
              handleFocusOpacity={handleFocusOpacity}
              setProgress={(value, down) => {
                let newProgress = [...progress];
                let newValue = value;
                if (progress[i + 1] && newValue > progress[i + 1]) {
                  newValue = progress[i + 1];
                }
                if (progress[i - 1] && newValue < progress[i - 1]) {
                  newValue = progress[i - 1];
                }
                newProgress[i] = newValue;
                setProgress(newProgress);
                if (onSwipe) {
                  let newValue = getValuesByProgress({
                    progress: newProgress,
                    min,
                    max,
                  });
                  setTimeout(() => {
                    onSwipe(newProgress, newValue);
                  }, 10);
                }
                if (down === false) {
                  setDown(false);
                }
              }}
              down={down}
              setDown={setDown}
              min={min}
              max={max}
              size={size}
              {...props}
              {...rest}
            />
          );
        })}

        {showTicks ? (
          <TicksWrap
            absolute
            l={vertical ? handleSize + tickGap : -(handleSize / 2)}
            t={vertical ? -(handleSize / 2) : handleSize + tickGap}
            r={vertical ? "auto" : -(handleSize / 2)}
            b={!vertical ? "auto" : -(handleSize / 2)}
            justify="space-between"
            row={!vertical}
            pointerEvents="none"
          >
            {getTicks({
              min,
              max,
              ticks: ticks ? ticks : steps < 10 ? 10 : steps,
              size,
              handleSize,
            }).map((tick, index) => {
              return (
                <TickWrap
                  w={!vertical ? handleSize : "auto"}
                  h={!vertical ? "auto" : handleSize}
                  flexCenter
                >
                  <Tick color="text" font="caption">
                    {tick}
                  </Tick>
                </TickWrap>
              );
            })}
          </TicksWrap>
        ) : null}
      </TrackWrap>
    </Wrap>
  );
}, "Slider");

Slider.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  onSwipe: PropTypes.func,
  progressColor: PropTypes.string,
  trackColor: PropTypes.string,
  trackHeight: PropTypes.number,
  valueSize: PropTypes.number,
  valueGap: PropTypes.number,
  handleSize: PropTypes.number,
  handleFactor: PropTypes.number,
  handleFocusOpacity: PropTypes.number,
  handleColor: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  steps: PropTypes.number,
  showValue: PropTypes.oneOf([PropTypes.bool, "onDown"]),
  formatValue: PropTypes.func,
  showTicks: PropTypes.bool,
  panValue: PropTypes.bool,
  ticks: PropTypes.number,
  tickGap: PropTypes.number,
  vertical: PropTypes.bool,
  minDistance: PropTypes.number,
  handleProps: PropTypes.object,
  springConfig: PropTypes.object,
  renderTrack: PropTypes.func,
};

Slider.defaultPropTypes = {
  value: 0,
  progressColor: "primary",
  trackColor: "background",
  trackHeight: 10,
  valueSize: 28,
  valueGap: 5,
  handleSize: 30,
  handleFactor: 2,
  handleFocusOpacity: 0.2,
  handleColor: "#FFF",
  min: 0,
  max: 100,
  steps: 1,
  showValue: false,
  showTicks: true,
  tickGap: 5,
  vertical: false,
  minDistance: 5,
  handleProps: {},
  springConfig: {},
};

export default Slider;
