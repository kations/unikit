import * as React from "react";
//import { scaleLinear } from 'd3-scale';

import Reanimated, {
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { useLayout } from "../../hooks";
import { withThemeProps, styled } from "../../style";
import { getProgress, getValueByProgress, isNumber } from "../../util";

import Button from "../Button";
import Flex from "../Flex";
import Animate from "../Animate";
import Draggable from "../Draggable";

Reanimated.addWhitelistedNativeProps({ text: true });
const Track = styled(Reanimated.createAnimatedComponent(Flex))();

const TrackProgress = ({
  progressColor,
  translationX,
  handleSize,
  trackHeight,
  borderRadius,
}) => {
  const widthStyle = useAnimatedStyle(() => {
    return {
      width: translationX.value,
      position: "absolute",
      height: trackHeight,
      top: handleSize / 2 - trackHeight / 2,
      right: handleSize / 2,
      borderRadius,
      pointerEvents: "none",
    };
  });
  return <Track bg={progressColor} style={widthStyle}></Track>;
};

const countDecimals = function (num: number) {
  if (Math.floor(num.valueOf()) === num.valueOf()) return 0;
  return num.toString().split(".")[1].length || 0;
};

const ValueButton = ({
  translationX,
  progressColor,
  handleSize,
  dragging,
  calcValue,
  onSlide,
  steps,
  formatValue,
  showValueOnDrag = false,
}) => {
  const [text, setText] = React.useState("0");

  const recordResult = (result: number) => {
    const v = calcValue(result, false);
    const decimalCount = countDecimals(steps);
    if (v !== text) {
      setText(`${v.toFixed(decimalCount)}`);
    }
  };

  React.useEffect(() => {
    if (onSlide && dragging) onSlide(parseFloat(text));
  }, [text]);

  useDerivedValue(() => {
    runOnJS(recordResult)(translationX.value);
  });

  return (
    <Animate
      visible={showValueOnDrag ? dragging : true}
      from={{ y: 10, opacity: 0 }}
      to={{ y: 0, opacity: 1 }}
      duration={500}
      absolute
      left={-100}
      right={-100}
      top={(-handleSize / 2) * 1.4}
      flexCenter
    >
      <Button
        bg={progressColor}
        size={handleSize * 0.66}
        rounded
        webStyle={{ userSelect: "none" }}
        labelProps={{ fontSize: 10 }}
      >
        {formatValue ? formatValue(text) : text}
      </Button>
    </Animate>
  );
};

const sortValue = (array: [number]) => {
  return array.sort(function (a, b) {
    return a - b;
  });
};

const Slider = ({
  theme,
  value = 0,
  onChange,
  trackColor = "input",
  handleColor = "input",
  progressColor = "primary",
  trackHeight = 10,
  handleSize = 30,
  showHandle = true,
  min = 0,
  max = 100,
  steps = 1,
  showValue = true,
  showValueOnDrag = false,
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
  formatValue,
  hideProgressTrack = false,
  onSlide,
  ...rest
}) => {
  const { onLayout, width } = useLayout();
  const [values, setValues] = React.useState(() =>
    Array.isArray(value) ? sortValue([...value]).reverse() : [value || 0]
  );

  React.useEffect(() => {
    const newValues = Array.isArray(value)
      ? sortValue([...value]).reverse()
      : [value || 0];
    if (JSON.stringify(newValues) !== JSON.stringify(values))
      setValues([...newValues]);
  }, [value]);
  //   const [progress, setProgress] = React.useState(() =>
  //     getProgress(min, max, value)
  //   );
  const borderRadius = isNumber(roundness)
    ? roundness
    : theme.globals.roundness;

  const calcValue = (position: number, forceSteps: boolean = false) => {
    const p = getProgress(0, width, position);
    let v = getValueByProgress(min, max, p);
    if ((v / steps) % 1 != 0) {
      v = Math.round(v / steps) * steps;
    }
    return v;
  };

  return (
    <Flex w="100%" px={handleSize / 2}>
      <Flex w="100%" h={handleSize} justifyContent="center" relative {...rest}>
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
        {width > 0
          ? values.map((v, i) => {
              const progress = getProgress(min, max, v);
              const x = progress * width;

              return (
                <Flex
                  l={-handleSize / 2}
                  t={0}
                  key={`slider-handle-${i}`}
                  absolute
                >
                  <Draggable
                    key={`slider-${i}`}
                    direction="x"
                    minX={
                      values[i + 1]
                        ? getProgress(min, max, values[i + 1]) * width
                        : 0
                    }
                    maxX={
                      values[i - 1]
                        ? getProgress(min, max, values[i - 1]) * width
                        : width
                    }
                    snapFactor={handleSize}
                    initialSnap={{ x }}
                    snap={{ x }}
                    onDragStop={(onDragStop) => {
                      let v = calcValue(onDragStop.x, true);
                      if (Array.isArray(value)) {
                        const newValue = [...values];
                        const findIndex = newValue.findIndex(
                          (ov, oi) => ov === v && i !== oi
                        );
                        console.log({ findIndex });
                        if (findIndex > -1) {
                          if (findIndex < i) {
                            v = v - steps;
                          } else {
                            v = v + steps;
                          }
                        }
                        newValue[i] = v;
                        const sortedNewValue = sortValue(newValue);
                        if (onChange) onChange(sortedNewValue);
                      } else {
                        if (onChange) onChange(v);
                      }
                    }}
                  >
                    {({ dragging, translationX }) => (
                      <>
                        {hideProgressTrack ? null : (
                          <TrackProgress
                            translationX={translationX}
                            progressColor={
                              values?.length > 1 && i === values?.length - 1
                                ? trackColor
                                : progressColor
                            }
                            trackHeight={trackHeight}
                            handleSize={handleSize}
                            borderRadius={borderRadius}
                          />
                        )}
                        <Animate
                          to={{ scale: dragging ? 1.2 : 1 }}
                          duration={500}
                          center
                          relative
                        >
                          <Animate
                            bg={progressColor}
                            to={{
                              scale: dragging ? 1.4 : 1,
                              opacity: dragging ? 0.5 : 0,
                            }}
                            duration={500}
                            borderRadius={handleSize / 2}
                            absoluteFill
                          />
                          {showValue ? (
                            <ValueButton
                              translationX={translationX}
                              progressColor={progressColor}
                              trackHeight={trackHeight}
                              handleSize={handleSize}
                              borderRadius={borderRadius}
                              calcValue={calcValue}
                              dragging={dragging}
                              onSlide={onSlide}
                              steps={steps}
                              formatValue={formatValue}
                              showValueOnDrag={showValueOnDrag}
                            />
                          ) : null}
                          <Flex
                            width={handleSize}
                            height={handleSize}
                            borderRadius={handleSize / 2}
                            borderWidth={1}
                            shadow={theme.globals.shadow}
                            borderColor={`${handleColor}:darken:5`}
                            bg={handleColor}
                          ></Flex>
                        </Animate>
                      </>
                    )}
                  </Draggable>
                </Flex>
              );
            })
          : null}
      </Flex>
    </Flex>
  );
};

export default withThemeProps(Slider, "Slider");
