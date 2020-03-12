import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  TouchableOpacity,
  Picker as PickerIOS
} from "react-native";
import PropTypes from "prop-types";

import styled, { withThemeProps, useTheme } from "../styled";
import { useDebounce, useUpdateEffect } from "../hooks";

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true
};

const Wrap = styled.View();
const Item = styled.TouchableOpacity();
const Label = styled.Text({
  font: "p",
  color: "text"
});

const getIndexByValue = (options, value) => {
  if (value === undefined) return 0;
  const findIndex = options.findIndex(
    option => option === value || option.value === value
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
    debounce = 250,
    onHapticFeedback,
    useScrollView = true,
    gap = 0,
    textAlign = "center",
    format,
    ...rest
  }) => {
    const theme = useTheme();

    const getLabel = item => {
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
              borderTopColor: theme.colors.text
            }}
            onValueChange={(itemValue, itemIndex) => {
              if (onChange) onChange(itemValue, itemIndex);
            }}
            itemStyle={{
              textAlign,
              ...theme.fonts.p,
              color: theme.colors.text
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

    useUpdateEffect(() => {
      const index = getIndexByValue(options, value);
      if (onChange && debouncedIndex % 1 === 0 && debouncedIndex !== index) {
        onChange(options[debouncedIndex] || null, debouncedIndex);
      }
    }, [debouncedIndex]);

    const scrollTo = ({ index }) => {
      if (scrollRef.current) {
        if (useScrollView) {
          scrollRef.current.scrollTo({
            x: 0,
            y: index * itemHeight,
            animated: true
          });
        } else {
          scrollRef.current.scrollToIndex({
            animated: true,
            index: index
          });
        }
      }
    };

    const onScroll = e => {
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
            paddingHorizontal: gap
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
        console.log({ active, value, index });
        setTimeout(() => {
          scrollTo({ index });
          setTimeout(() => {
            setMounted(true);
          }, 500);
        }, 10);
      }
    }, []);

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
            nestedScrollEnabled={true}
            scrollEventThrottle={60}
            snapToAlignment="start"
            pagingEnabled
            snapToInterval={itemHeight}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            disableScrollViewPanResponder
            onScroll={onScroll}
          >
            <Item w="100%" h={itemHeight}></Item>
            {options.map((item, index) => renderItem({ item, index }))}
            <Item w="100%" h={itemHeight}></Item>
          </ScrollView>
        ) : (
          <FlatList
            ref={scrollRef}
            data={options}
            virtualized
            initialScrollIndex={
              Platform.OS === "web"
                ? undefined
                : getIndexByValue(options, value)
            }
            keyExtractor={item => `item-${item.value ? item.value : item}`}
            snapToAlignment="start"
            pagingEnabled
            snapToInterval={itemHeight}
            getItemLayout={(data, index) => ({
              length: itemHeight,
              offset: itemHeight * index,
              index
            })}
            nestedScrollEnabled={true}
            scrollEventThrottle={60}
            ListHeaderComponent={<Item w="100%" h={itemHeight}></Item>}
            ListFooterComponent={<Item w="100%" h={itemHeight}></Item>}
            showsVerticalScrollIndicator={false}
            style={{ height: itemHeight * 3, flex: 1 }}
            onScroll={onScroll}
            renderItem={renderItem}
            disableVirtualization={false}
            viewabilityConfig={VIEWABILITY_CONFIG}
          />
        )}
      </Wrap>
    );
  },
  "Picker"
);

export default Picker;

// const Container = styled.View`
//   height: ${props => props.wrapperHeight};
//   flex: 1;
//   overflow: hidden;
//   align-self: center;
//   width: ${props => props.wrapperWidth};
//   background-color: ${props => props.wrapperBackground};
// `;
// export const HighLightView = styled.View`
//   position: absolute;
//   top: ${props => (props.wrapperHeight - props.itemHeight) / 2};
//   height: ${props => props.itemHeight};
//   width: ${props => props.highlightWidth};
//   border-top-color: ${props => props.highlightColor};
//   border-bottom-color: ${props => props.highlightColor};
//   border-top-width: ${props => props.highlightBorderWidth}px;
//   border-bottom-width: ${props => props.highlightBorderWidth}px;
// `;
// export const SelectedItem = styled.View`
//   height: 30px;
//   justify-content: center;
//   align-items: center;
//   height: ${props => props.itemHeight};
// `;
// export const ItemText = styled.Text`
//   color: ${props => props.color};
//   font-size: ${props => props.fontSize}px;
//   line-height: ${props => props.lineHeight}px;
//   text-align: center;
// `;
// const deviceWidth = Dimensions.get("window").width;
// export default class ScrollPicker extends React.Component {
//   constructor() {
//     super();
//     this.onMomentumScrollBegin = this.onMomentumScrollBegin.bind(this);
//     this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
//     this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
//     this.onScrollEndDrag = this.onScrollEndDrag.bind(this);
//     this.state = {
//       selectedIndex: 1
//     };
//   }

//   componentDidMount() {
//     if (this.props.selectedIndex) {
//       setTimeout(() => {
//         this.scrollToIndex(this.props.selectedIndex);
//       }, 0);
//     }
//   }

//   componentWillUnmount() {
//     if (this.timer) {
//       clearTimeout(this.timer);
//     }
//   }

//   render() {
//     const { header, footer } = this.renderPlaceHolder();
//     return (
//       <Container
//         wrapperHeight={this.props.wrapperHeight}
//         wrapperWidth={this.props.wrapperWidth}
//         wrapperBackground={this.props.wrapperBackground}
//       >
//         <HighLightView
//           highlightColor={this.props.highlightColor}
//           highlightWidth={this.props.highlightWidth}
//           wrapperHeight={this.props.wrapperHeight}
//           itemHeight={this.props.itemHeight}
//           highlightBorderWidth={this.props.highlightBorderWidth}
//         />
//         <ScrollView
//           ref={sview => {
//             this.sview = sview;
//           }}
//           bounces={false}
//           showsVerticalScrollIndicator={false}
//           onTouchStart={this.props.onTouchStart}
//           onMomentumScrollBegin={this.onMomentumScrollBegin}
//           onMomentumScrollEnd={this.onMomentumScrollEnd}
//           onScrollBeginDrag={this.onScrollBeginDrag}
//           onScrollEndDrag={this.onScrollEndDrag}
//         >
//           {header}
//           {this.props.dataSource.map(this.renderItem.bind(this))}
//           {footer}
//         </ScrollView>
//       </Container>
//     );
//   }

//   renderPlaceHolder() {
//     const height = (this.props.wrapperHeight - this.props.itemHeight) / 2;
//     const header = <View style={{ height, flex: 1 }} />;
//     const footer = <View style={{ height, flex: 1 }} />;
//     return { header, footer };
//   }

//   renderItem(data, index) {
//     const isSelected = index === this.state.selectedIndex;
//     const { fontSize, lineHeight, displayField } = this.props;

//     // Render a custom property of an object
//     let display = data;
//     if (
//       displayField !== undefined &&
//       data.hasOwnProperty(displayField) === true
//     ) {
//       display = data[displayField];
//     }

//     const item = (
//       <ItemText
//         fontSize={fontSize}
//         lineHeight={lineHeight}
//         color={isSelected ? this.props.activeItemColor : this.props.itemColor}
//       >
//         {display}
//       </ItemText>
//     );

//     return (
//       <SelectedItem key={index} itemHeight={this.props.itemHeight}>
//         {item}
//       </SelectedItem>
//     );
//   }

//   scrollFix(e) {
//     let verticalY = 0;
//     const h = this.props.itemHeight;
//     if (e.nativeEvent.contentOffset) {
//       verticalY = e.nativeEvent.contentOffset.y;
//     }
//     const selectedIndex = Math.round(verticalY / h);
//     const verticalElem = selectedIndex * h;
//     if (verticalElem !== verticalY) {
//       // using scrollTo in ios, onMomentumScrollEnd will be invoked
//       if (Platform.OS === "ios") {
//         this.isScrollTo = true;
//       }
//       this.sview.scrollTo({ y: verticalElem });
//     }
//     if (this.state.selectedIndex === selectedIndex) {
//       return;
//     }
//     this.setState({
//       selectedIndex
//     });
//     // onValueChange
//     if (this.props.onValueChange) {
//       const selectedValue = this.props.dataSource[selectedIndex];
//       this.props.onValueChange(selectedValue, selectedIndex);
//     }
//   }
//   onScrollBeginDrag() {
//     this.dragStarted = true;
//     if (Platform.OS === "ios") {
//       this.isScrollTo = false;
//     }
//     if (this.timer) {
//       clearTimeout(this.timer);
//     }
//   }
//   onScrollEndDrag(e) {
//     this.props.onScrollEndDrag();
//     this.dragStarted = false;
//     // if not used, event will be garbaged
//     const element = {
//       nativeEvent: {
//         contentOffset: {
//           y: e.nativeEvent.contentOffset.y
//         }
//       }
//     };
//     if (this.timer) {
//       clearTimeout(this.timer);
//     }
//     this.timer = setTimeout(() => {
//       if (!this.momentumStarted && !this.dragStarted) {
//         this.scrollFix(element, "timeout");
//       }
//     }, 10);
//   }
//   onMomentumScrollBegin() {
//     this.momentumStarted = true;
//     if (this.timer) {
//       clearTimeout(this.timer);
//     }
//   }
//   onMomentumScrollEnd(e) {
//     this.props.onMomentumScrollEnd();
//     this.momentumStarted = false;
//     if (!this.isScrollTo && !this.momentumStarted && !this.dragStarted) {
//       this.scrollFix(e);
//     }
//   }

//   scrollToIndex(ind) {
//     this.setState({
//       selectedIndex: ind
//     });
//     const y = this.props.itemHeight * ind;
//     this.sview.scrollTo({ y });
//   }
// }
// ScrollPicker.propTypes = {
//   style: PropTypes.object,
//   dataSource: PropTypes.array,
//   displayField: PropTypes.string,
//   fontSize: PropTypes.number,
//   lineHeight: PropTypes.number,
//   selectedIndex: PropTypes.number,
//   onValueChange: PropTypes.func,
//   renderItem: PropTypes.func,
//   highlightColor: PropTypes.string,
//   itemHeight: PropTypes.number,
//   wrapperBackground: PropTypes.string,
//   wrapperWidth: PropTypes.number,
//   wrapperHeight: PropTypes.number,
//   highlightWidth: PropTypes.number,
//   highlightBorderWidth: PropTypes.number,
//   activeItemColor: PropTypes.string,
//   itemColor: PropTypes.string,
//   onMomentumScrollEnd: PropTypes.func,
//   onScrollEndDrag: PropTypes.func
// };
// ScrollPicker.defaultProps = {
//   dataSource: [1, 2, 3],
//   fontSize: 20,
//   lineHeight: 26,
//   itemHeight: 60,
//   wrapperBackground: "#FFFFFF",
//   wrapperHeight: 180,
//   wrapperWidth: 150,
//   highlightWidth: deviceWidth,
//   highlightBorderWidth: 2,
//   highlightColor: "#333",
//   activeItemColor: "#222121",
//   itemColor: "#B4B4B4",
//   onMomentumScrollEnd: () => {},
//   onScrollEndDrag: () => {}
// };
