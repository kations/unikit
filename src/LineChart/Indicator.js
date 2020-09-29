import * as React from "react";
import { svgPathProperties } from "svg-path-properties";
import * as shape from "d3-shape";

import Flex from "../Flex";
import Button from "../Button";
import styled, { useTheme } from "../styled";
import { AnimatedView, useSpring } from "../Spring";
import { useGesture } from "../hooks";
import { getProgress, getValueByProgress } from "../util";
import { isNumber } from "../util";

const ValueWrap = styled(AnimatedView)();
const ValuePoint = styled(AnimatedView)();

function getPathCoordinates({
  width,
  data,
  scaleX,
  scaleY,
  objKey,
  progress,
  curve,
}) {
  const d = shape
    .line()
    .x((p, i) => scaleX(i))
    .y((p) => {
      const v = p[objKey] || p || 0;
      return scaleY(isNumber(v) ? v : 0);
    })
    .curve(curve)(data);
  const properties = new svgPathProperties(d);
  const pathLength = properties.getTotalLength();
  const _x = progress * width;
  var beginning = _x,
    end = pathLength,
    target,
    pos;
  target = Math.floor((beginning + end) / 2);

  while (true) {
    target = Math.floor((beginning + end) / 2);
    pos = properties.getPointAtLength(target);

    if ((target === end || target === beginning) && pos.x !== _x) {
      break;
    }
    if (pos.x > _x) {
      end = target;
    } else if (pos.x < _x) {
      beginning = target;
    } else {
      break; //position found
    }
  }
  return pos;
}

const ValueDot = ({
  getPos,
  label,
  xLabel,
  value,
  progress,
  color,
  springConfig,
  strokeWidth,
  showValue = false,
}) => {
  const theme = useTheme();
  const pos = React.useMemo(() => getPos(), [progress]);

  const y = useSpring({
    to: pos.y,
    config: springConfig,
  });
  const switchLabel = progress > 0.5;

  return (
    <ValuePoint
      w={10}
      h={10}
      borderRadius={15}
      borderWidth={strokeWidth || 1}
      absolute
      t={-5}
      l={-5}
      bg="surface"
      borderColor={theme.colors[color] || color}
      style={{ transform: [{ translateY: y }] }}
      alignItems={"flex-start"}
      justifyContent="center"
    >
      {showValue && (
        <Flex
          w={500}
          ml={switchLabel ? -505 : 12}
          alignItems={switchLabel ? "flex-end" : "flex-start"}
        >
          <Button bg={color || "surface"} rounded size={22}>
            {`${label ? `${label} ` : ""}${xLabel ? `${xLabel} ` : ""}${
              value !== undefined ? `${value}` : ""
            }`}
          </Button>
        </Flex>
      )}
    </ValuePoint>
  );
};

export default ({
  data,
  keys,
  keyProps,
  width,
  springConfig,
  hideValueOnBlur,
  color,
  formatValue,
  valuePosition,
  valueOffset,
  onChange,
  onBlur,
  scaleX,
  scaleY,
  dots,
  indicator,
  contentInset,
  curve,
  ...rest
}) => {
  const theme = useTheme();
  const [show, setShow] = React.useState(false);
  const [progress, setProgress] = React.useState(1);
  const [index, setIndex] = React.useState(data.length - 1);
  const stroke = theme.colors[color] || color;
  const obj = data[index];

  const dist = useSpring({
    to: progress * width,
    immediate: !show,
    config: springConfig,
  });

  const bindGesture = useGesture(
    {
      onMoveShouldSetPanResponderCapture: (e, { dy, dx }) => {
        return Math.abs(dx) > 5;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e, { dy, dx }) => {
        const dist = e.nativeEvent.locationX;
        let newProgress = getProgress(0, width, dist);
        if (newProgress < 0) {
          newProgress = 0;
        } else if (newProgress > 1) {
          newProgress = 1;
        }
        setProgress(newProgress);
        setTimeout(() => {
          setShow(true);
        }, 10);
      },
      onPanResponderMove: (e, { dy, dx }) => {
        const dist = dx;
        const currentPosition = progress * width + dist;
        let newProgress = getProgress(0, width, currentPosition);
        if (newProgress < 0) {
          newProgress = 0;
        } else if (newProgress > 1) {
          newProgress = 1;
        }

        setProgress(newProgress);
      },
      onPanResponderRelease: (e, { vx, vy }) => {
        setShow(false);
        if (onBlur) onBlur();
      },
    },
    [width, show]
  );

  React.useEffect(() => {
    const newIndex = getValueByProgress(0, data.length - 1, progress);

    if (Math.round(newIndex) !== index) {
      setIndex(Math.round(newIndex));
      if (onChange) onChange({ progress, index: Math.round(newIndex) });
      if (theme.onFeedback) theme.onFeedback("selection");
    }
  }, [progress]);

  return (
    <Flex
      absoluteFill
      pl={contentInset.left}
      {...bindGesture}
      collapsable={false}
      onMouseOver={
        !indicator
          ? undefined
          : (e) => {
              setShow(true);
            }
      }
      onMouseMove={
        !indicator
          ? undefined
          : (e) => {
              const { layerX } = e.nativeEvent;
              let newProgress = getProgress(0, width, layerX);
              if (newProgress < 0) {
                newProgress = 0;
              } else if (newProgress > 1) {
                newProgress = 1;
              }
              setProgress(newProgress);
            }
      }
      onMouseLeave={
        !indicator
          ? undefined
          : () => {
              setShow(false);
              if (onBlur) onBlur();
            }
      }
    >
      <ValueWrap
        style={{
          height: "100%",
          width: 1,
          backgroundColor: indicator ? theme.colors.border : "transparent",
          overflow: "visible",
          opacity: !show && hideValueOnBlur ? 0 : 1,
          transform: [{ translateX: dist }],
        }}
      >
        <Flex h="100%" pointerEvents="none" relative>
          {dots
            ? keys.map((key) => {
                const props = keyProps[key] || {};
                if (props.dots === false || props.type === "bar") return null;
                const v = data[index][key] || data[index] || 0;
                const value = isNumber(v) ? v : "-";
                return (
                  <ValueDot
                    color={color}
                    progress={progress}
                    xLabel={
                      data[index] && data[index].label
                        ? data[index].label
                        : undefined
                    }
                    value={
                      data[index]
                        ? formatValue
                          ? formatValue(value)
                          : value
                        : undefined
                    }
                    getPos={() =>
                      getPathCoordinates({
                        width,
                        data,
                        scaleX,
                        scaleY,
                        objKey: key,
                        progress,
                        curve,
                      })
                    }
                    {...props}
                    {...rest}
                  />
                );
              })
            : null}
          <Flex
            h="100%"
            w={1000}
            mx={1}
            alignItems={progress > 0.5 ? "flex-end" : "flex-start"}
            justifyContent={valuePosition === "top" ? "flex-start" : "flex-end"}
            py={valueOffset}
            r={progress < 0.5 ? "auto" : 0}
            l={progress > 0.5 ? "auto" : 0}
            t={0}
            absolute
          ></Flex>
        </Flex>
      </ValueWrap>
    </Flex>
  );
};
