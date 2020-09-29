import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  TouchableOpacity,
  Picker as PickerIOS,
} from "react-native";
import PropTypes from "prop-types";

import styled, { withThemeProps, useTheme } from "../styled";
import { useDebounce, useUpdateEffect } from "../hooks";

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
};

const Wrap = styled.View();
const Item = styled.TouchableOpacity();
const Label = styled.Text({
  font: "p",
  color: "text",
});

const getIndexByValue = (options, value) => {
  if (value === undefined) return 0;
  const findIndex = options.findIndex(
    (option) => option === value || option.value === value
  );
  return findIndex;
};

const Picker = withThemeProps(
  ({
    value = 1,
    onChange,
    options = [1, 2, 3],
    placeholder,
    itemHeight = 50,
    lineHeight = 1,
    debounce = 1000,
    onHapticFeedback,
    useScrollView = true,
    gap = 0,
    textAlign = "center",
    format,
    ...rest
  }) => {
    const theme = useTheme();

    const getLabel = (item) => {
      let label = item.label ? item.label : item;
      if (format) {
        label = format(item);
      }
      return label.toString();
    };

    if (Platform.OS === "ios") {
      return (
        <Wrap h={itemHeight * 3} overflow="hidden" relative {...rest}>
          <PickerIOS
            selectedValue={value}
            style={{
              height: itemHeight * 3,
              width: "100%",
              paddingHorizontal: gap,
              borderTopColor: theme.colors.text,
            }}
            onValueChange={(itemValue, itemIndex) => {
              if (onChange) onChange(itemValue, itemIndex);
            }}
            itemStyle={{
              textAlign,
              ...theme.fonts.p,
              color: theme.colors.text,
            }}
          >
            {placeholder ? (
              <PickerIOS.Item label={placeholder} value={null} />
            ) : null}
            {options.map((item, index) => {
              return (
                <PickerIOS.Item
                  key={index}
                  label={getLabel(item)}
                  value={item.value ? item.value : item}
                />
              );
            })}
          </PickerIOS>
        </Wrap>
      );
    }

    const [active, setActive] = useState(getIndexByValue(options, value));
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef(null);

    const debouncedIndex = useDebounce(active, debounce);

    const scrollTo = ({ index }) => {
      if (scrollRef.current) {
        if (useScrollView) {
          scrollRef.current.scrollTo({
            x: 0,
            y: index * itemHeight,
            animated: true,
          });
        } else {
          scrollRef.current.scrollToIndex({
            animated: true,
            index: index,
          });
        }
      }
    };

    const onScroll = (e) => {
      if (mounted) {
        const { y } = e.nativeEvent.contentOffset;
        let index = y / itemHeight;
        setActive(index);
      }
    };

    const renderItem = ({ item, index }) => {
      const isActive = Math.round(active) === index;
      return (
        <TouchableOpacity
          key={index}
          style={{
            width: "100%",
            height: itemHeight,
            justifyContent: "center",
            paddingHorizontal: gap,
          }}
          onPress={() => {
            scrollTo({ index });
          }}
          activeOpacity={1}
        >
          <Label
            style={{ opacity: isActive ? 1 : 0.5, width: "100%", textAlign }}
          >
            {getLabel(item)}
          </Label>
        </TouchableOpacity>
      );
    };

    useUpdateEffect(() => {
      if (scrollRef.current) {
        const index = getIndexByValue(options, value);
        setActive(index);
        scrollTo({ index });
        setMounted(true);
      }
    }, [value]);

    useEffect(() => {
      if (scrollRef.current) {
        const index = getIndexByValue(options, value);
        setTimeout(() => {
          scrollTo({ index });
          setTimeout(() => {
            setMounted(true);
          }, 500);
        }, 10);
      }
    }, []);

    const onScrollEnd = () => {
      let index = Math.round(active);
      const newValue = options[index] !== undefined ? options[index] : null;
      if (index > options.length - 1) index = options.length - 1;
      if (newValue !== value) {
        if (onChange) onChange(newValue, index);
      }
    };

    useUpdateEffect(() => {
      if (Platform.OS === "web") {
        onScrollEnd();
      }
    }, [debouncedIndex]);

    const scrollerProps = {
      nestedScrollEnabled: true,
      scrollEventThrottle: 60,
      snapToAlignment: "start",
      pagingEnabled: true,
      snapToInterval: itemHeight,
      decelerationRate: "fast",
      showsVerticalScrollIndicator: false,
      onScroll: onScroll,
      onMomentumScrollEnd: onScrollEnd,
      //onScrollEndDrag: onScrollEnd
    };

    return (
      <Wrap h={itemHeight * 3} overflow="hidden" relative {...rest}>
        <Item
          w="100%"
          absolute
          l={0}
          t="50%"
          mt={-(itemHeight / 2)}
          h={itemHeight}
          opacity={0.2}
          borderTopWidth={lineHeight}
          borderBottomWidth={lineHeight}
          borderColor="text"
          pointerEvents="none"
          zIndex={0}
        />
        {useScrollView ? (
          <ScrollView
            ref={scrollRef}
            decelerationRate="fast"
            disableScrollViewPanResponder
            {...scrollerProps}
          >
            <Item w="100%" h={itemHeight}></Item>
            {options.map((item, index) => renderItem({ item, index }))}
            <Item w="100%" h={itemHeight}></Item>
          </ScrollView>
        ) : (
          <FlatList
            ref={scrollRef}
            data={options}
            initialScrollIndex={
              Platform.OS === "web"
                ? undefined
                : getIndexByValue(options, value)
            }
            keyExtractor={(item) => `item-${item.value ? item.value : item}`}
            getItemLayout={(data, index) => ({
              length: itemHeight,
              offset: itemHeight * index,
              index,
            })}
            ListHeaderComponent={<Item w="100%" h={itemHeight}></Item>}
            ListFooterComponent={<Item w="100%" h={itemHeight}></Item>}
            style={{ height: itemHeight * 3, flex: 1 }}
            renderItem={renderItem}
            disableVirtualization={false}
            viewabilityConfig={VIEWABILITY_CONFIG}
            {...scrollerProps}
          />
        )}
      </Wrap>
    );
  },
  "Picker"
);

export default Picker;
