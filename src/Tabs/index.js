import React, { useState } from "react";
import * as PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";
import { useLayout, useUpdateEffect } from "../hooks";
import Group from "../Group";
import Button from "../Button";
import { AnimatedView, useSpring, Animated } from "../Spring";
const { concat } = Animated;

const Indicator = styled(AnimatedView)();

const getIndexByValue = (options, value) => {
  if (value === undefined) return 0;
  const findIndex = options.findIndex(
    (option) => option === value || option.value === value
  );
  return findIndex;
};

const IndicatorComp = ({
  to,
  indicatorSize,
  options,
  vertical,
  indicatorColor,
  springConfig,
  ...rest
}) => {
  const x = useSpring({
    to: to,
    config: springConfig, //{ mass: 1, tension: 300, friction: 30, duration: 300 }
  });

  return (
    <Indicator
      pointerEvents="none"
      absolute
      bg={indicatorColor}
      vertical={vertical}
      zIndex={0}
      {...rest}
      style={{
        ...(rest.style || {}),
        transform: vertical ? [{ translateY: x }] : [{ translateX: x }],
        width: vertical ? indicatorSize : `${100 / options.length}%`,
        height: !vertical ? indicatorSize : `${100 / options.length}%`,
      }}
    />
  );
};

const Tabs = withThemeProps(
  ({
    value,
    onChange,
    options = [],
    vertical,
    tabSize = 50,
    font,
    bg = "background",
    inactiveColor = "primary",
    inactiveColorAlpha = 0.6,
    activeColor = "primary",
    indicatorColor = "primary",
    tabProps = {},
    indicatorSize = 3,
    indicatorProps = {},
    springConfig = {},
    theme,
    ...rest
  }) => {
    const [active, setActive] = useState(
      () => getIndexByValue(options, value) || 0
    );
    const { onLayout, width, height } = useLayout();
    const size = vertical ? height : width;
    const to = Math.round(active * (size / options.length)) + 0.0001;

    useUpdateEffect(() => {
      const newIndex = getIndexByValue(options, value);
      if (newIndex !== active) {
        setActive(newIndex);
      }
    }, [value]);

    return (
      <Group
        relative
        bg={bg}
        h={tabSize}
        row={!vertical}
        onLayout={onLayout}
        {...rest}
      >
        {size > 0 && (
          <IndicatorComp
            to={to}
            indicatorColor={indicatorColor}
            indicatorSize={indicatorSize}
            springConfig={springConfig}
            options={options}
            {...indicatorProps}
          />
        )}
        {options.map((item, index) => {
          const isActive = index === active;
          return (
            <Button
              bg={"transparent"}
              color={isActive ? activeColor : inactiveColor}
              key={index}
              size={tabSize}
              onPress={() => {
                setActive(index);
                setTimeout(() => {
                  if (theme.onFeedback) theme.onFeedback("success");
                  if (onChange)
                    onChange(item.value !== undefined ? item.value : item);
                }, 10);
              }}
              {...tabProps}
              labelProps={{
                ...tabProps.labelProps,
                ...(font ? { font } : {}),
                bgAware: bg,
                colorAlpha: isActive ? undefined : inactiveColorAlpha,
              }}
              zIndex={100}
            >
              {item.label || item}
            </Button>
          );
        })}
      </Group>
    );
  },
  "Tabs"
);

const PropComponent = () => null;

Tabs.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  vertical: PropTypes.bool,
  tabSize: PropTypes.number,
  font: PropTypes.string,
  bg: PropTypes.string,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  indicatorColor: PropTypes.string,
  tabProps: PropTypes.object,
  indicatorSize: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  indicatorProps: PropTypes.object,
};

//Just for docs
Tabs.defaultPropTypes = {
  options: [],
  tabSize: 50,
  bg: "background",
  activeColor: "primary",
  indicatorColor: "primary",
  tabProps: {},
  indicatorSize: 3,
  indicatorProps: {},
};

export default Tabs;
