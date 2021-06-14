import * as React from 'react';

import Animate from '../Animate';
import Button from '../Button';
import Group from '../Group';
import Flex from '../Flex';

import { withThemeProps } from '../../style';
import { useLayout, useUpdateEffect } from '../../hooks';
import { isFunction, isNumber } from '../../util';

const getIndexByValue = (options, value) => {
  if (value === undefined) return 0;
  const findIndex = options.findIndex(
    (option) => option === value || option.value === value
  );
  return findIndex;
};

export function Tabs(
  {
    value,
    onChange,
    options = [],
    vertical,
    size = 50,
    bg = 'surface',
    inactiveColor = 'primary',
    activeColor = '#FFF',
    indicatorColor = 'primary',
    indicatorOffset,
    tabProps = {},
    indicatorSize,
    indicatorProps = {},
    springConfig = {},
    theme,
    roundness,
    ...rest
  },
  ref
) {
  const [active, setActive] = React.useState(
    () => getIndexByValue(options, value) || 0
  );
  const { onLayout, width, height } = useLayout();
  const totalSize = vertical ? height : width;
  const to = Math.round(active * (totalSize / options.length)) + 0.0001;

  useUpdateEffect(() => {
    const newIndex = getIndexByValue(options, value);
    if (newIndex !== active) {
      setActive(newIndex);
    }
  }, [value]);

  return (
    <Flex
      bg={bg}
      {...rest}
      borderRadius={isNumber(roundness) ? roundness : theme.globals.roundness}
    >
      {totalSize > 0 && (
        <Animate
          bg={indicatorColor}
          absolute
          left={0}
          top={indicatorOffset || 0}
          w={`${100 / options.length}%`}
          pointerEvents="none"
          from={{ x: to }}
          to={{ x: to }}
          zIndex={0}
          h={indicatorSize || size}
          borderRadius={roundness || theme.globals.roundness}
          {...indicatorProps}
        />
      )}
      <Group
        relative
        width="100%"
        h={size}
        row={!vertical}
        onLayout={onLayout}
        relative
      >
        {options.map((item, index) => {
          const isActive = index === active;
          const color = isActive ? activeColor : inactiveColor;
          return (
            <Button
              flex={1}
              bg="transparent"
              color={color}
              key={index}
              size={size}
              onPress={() => {
                setActive(index);
                setTimeout(() => {
                  if (theme.onFeedback) theme.onFeedback('success');
                  if (onChange)
                    onChange(item.value !== undefined ? item.value : item);
                }, 10);
              }}
              borderRadius={roundness || theme.globals.roundness}
              py={0}
              {...tabProps}
              labelProps={{
                ...tabProps.labelProps,
              }}
              zIndex={100}
            >
              {item.label
                ? isFunction(item.label)
                  ? item.label({ index, active: isActive, color })
                  : item.label
                : item}
            </Button>
          );
        })}
      </Group>
    </Flex>
  );
}

export default withThemeProps(Tabs, 'Tabs');
