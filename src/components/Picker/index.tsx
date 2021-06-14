import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import { withThemeProps, Touchable } from '../../style';
import { useUpdateEffect } from '../../hooks';

import Flex from '../Flex';
import Text from '../Text';

const getIndexByValue = (options, value) => {
  if (value === undefined) return 0;
  const findIndex = options.findIndex(
    (option) => option === value || option.value === value
  );
  return findIndex;
};

const Item = React.memo(
  ({ itemHeight, label, gap = 0, textAlign = 'center', onPress, opacity }) => {
    return (
      <Touchable
        style={{
          width: '100%',
          height: itemHeight,
          justifyContent: 'center',
          paddingHorizontal: gap,
          opacity,
        }}
        onPress={onPress}
        activeOpacity={1}
      >
        <Text style={{ width: '100%', textAlign }}>{label}</Text>
      </Touchable>
    );
  }
);

const Picker = ({
  theme,
  value = 1,
  onChange,
  options = [1, 2, 3],
  placeholder,
  itemHeight = 44,
  items = 5,
  lineHeight = 1,
  debounce = 200,
  onHapticFeedback,
  useScrollView = false,
  gap = 0,
  textAlign = 'center',
  format,
  ...rest
}) => {
  const [index, setIndex] = useState(getIndexByValue(options, value));
  const scrollRef = useRef(null);
  const timeoutRef = useRef(null);

  const onScroll = (e) => {
    const { contentOffset } = e.nativeEvent;
    const newIndex = Math.round(contentOffset.y / itemHeight);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(function () {
      if (newIndex !== index) setIndex(newIndex);
    }, 100);
  };
  const getLabel = (item) => {
    let label = item.label ? item.label : item;
    if (format) {
      label = format(item);
    }
    return label.toString();
  };

  useUpdateEffect(() => {
    if (onChange) onChange(options[index].value || options[index], index);
  }, [index]);

  useUpdateEffect(() => {
    const newIndex = getIndexByValue(options, value);
    if (newIndex !== index) {
      setIndex(newIndex);
      scrollTo({ index: newIndex });
    }
  }, [value]);

  const scrollTo = ({ index, animated = true }) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: 0,
        y: index * itemHeight,
        animated,
      });
    }
  };

  const renderItem = ({ item, index }) => {
    const isActive = Math.round(index) === index;
    return (
      <Item
        key={`${index}`}
        itemHeight={itemHeight}
        label={getLabel(item)}
        opacity={isActive ? 1 : 0}
        onPress={() => {
          scrollTo({ index });
        }}
      />
    );
  };

  useUpdateEffect(() => {
    if (scrollRef.current) {
      const newIndex = getIndexByValue(options, value);
      if (newIndex !== index) {
        setIndex(index);
      }
    }
  }, [value]);

  useEffect(() => {
    if (scrollRef.current) {
      const index = getIndexByValue(options, value);
      setTimeout(() => {
        scrollTo({ index, animated: false });
      }, 10);
    }
  }, []);

  const scrollerProps = {
    nestedScrollEnabled: true,
    scrollEventThrottle: 16,
    snapToAlignment: 'start',
    pagingEnabled: true,
    snapToInterval: itemHeight,
    decelerationRate: 'fast',
    showsVerticalScrollIndicator: false,
    onScroll: onScroll,
    bounces: true,
  };

  const height = itemHeight * items;

  return (
    <Flex
      width="100%"
      overflow="hidden"
      position="relative"
      {...rest}
      height={height}
    >
      <Flex
        w="100%"
        absolute
        left={0}
        top="50%"
        mt={-(itemHeight / 2)}
        h={itemHeight}
        opacity={0.2}
        bg="primary:setAlpha:0.5"
        borderRadius={theme.globals.roundness}
        pointerEvents="none"
        zIndex={0}
      />

      <ScrollView
        ref={scrollRef}
        style={{
          height: height,
        }}
        {...scrollerProps}
      >
        <Flex height={height / 2 - itemHeight / 2} width="100%" />
        {options.map((item, index) => renderItem({ item, index }))}
        <Flex height={height / 2 - itemHeight / 2} width="100%" />
      </ScrollView>
    </Flex>
  );
};

export default withThemeProps(Picker, 'Picker');
