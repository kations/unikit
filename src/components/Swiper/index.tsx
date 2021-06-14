import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { View } from 'react-native';

import Flex from '../Flex';

import { withThemeProps, styled, Touchable } from '../../style';
import { useLayout, useInterval } from '../../hooks';
import { getProgress, getValueByProgress } from '../../util';
import Icon from '../Icon';
import Animate from '../Animate';
import Draggable from '../Draggable';

export function Swiper(
  {
    activeIndex = 0,
    children,
    vertical = false,
    autoplay = false,
    gesture = true,
    arrows = false,
    arrowProps = { color: '#FFF', strokeWidth: 0.5 },
    arrowWrapperProps = {},
    arrowDisabledAlpha = 0.3,
    dots = false,
    dotsProps = {},
    itemProps = {},
    autoplayTimeout = 3000,
    minDistance = 5,
    triggerDistance = 0.2,
    springConfig = {},
    onSwipe,
    onSwipeEnd,
    renderOnActive = false,
    gestureProps = {},
    gap = 0,
    itemDimension,
    ...rest
  },
  ref
) {
  const dragRef = React.useRef(null);
  const [index, setIndex] = useState(activeIndex);
  const items = React.Children.toArray(children);
  const { onLayout, width, height } = useLayout();

  if (typeof itemDimension === 'string') {
    itemDimension =
      (parseFloat(itemDimension.replace('%', '')) / 100) *
        (vertical ? height : width) +
      gap / items.length;
  }

  useInterval(
    () => {
      dragRef.current?.snapToIndex((index + 1) % items.length);
      setIndex((index + 1) % items.length);
    },
    autoplay && !dragRef?.current?.dragging ? autoplayTimeout : null
  );

  const swipeToIndex = (idx) => {
    dragRef.current?.snapToIndex(idx);
    setIndex(idx);
  };

  useImperativeHandle(ref, () => ({
    swipeNext: () => {
      swipeToIndex(index + 1);
    },
    swipePrev: () => {
      swipeToIndex(index - 1);
    },
    swipeTo: (newIndex) => {
      swipeToIndex(newIndex);
    },
  }));

  const itemSize = itemDimension ? itemDimension : vertical ? height : width;

  return (
    <Flex
      onLayout={onLayout}
      w="100%"
      height={100}
      overflow="hidden"
      relative
      {...rest}
    >
      <Draggable
        ref={dragRef}
        direction={vertical ? 'y' : 'x'}
        maxX={itemSize / 2}
        maxY={itemSize / 2}
        minX={-((items.length - 0.5) * itemSize)}
        minY={-((items.length - 0.5) * itemSize)}
        snapTo={items.map((child, i) => ({
          x: vertical ? 0 : i * -itemSize,
          y: vertical ? i * -itemSize : 0,
        }))}
        reverseVelocity
        snapFactor={itemSize / 2}
        onSnap={(index) => {
          setIndex(index);
          if (onSwipeEnd) onSwipeEnd(index);
        }}
        style={{
          width: vertical ? '100%' : items.length * itemSize,
          height: vertical ? items.length * height : 200,
          flexDirection: 'row',
        }}
        pressableProps={{
          row: !vertical,
          width: vertical ? '100%' : items.length * itemSize,
          height: vertical ? items.length * height : 200,
          marginLeft: width - itemSize / 2,
        }}
      >
        {({ dragging, translationX }) =>
          items.map((child, i) => {
            const isActive = activeIndex === i;
            return (
              <View
                style={{
                  width: vertical ? '100%' : itemDimension || width,
                  height: !vertical ? '100%' : itemDimension || height,
                  paddingRight: !vertical ? gap : 0,
                  paddingBottom: vertical ? gap : 0,
                }}
                key={`swiper-${i}`}
              >
                {!isActive && renderOnActive ? null : (
                  <Animate
                    to={{ scale: dragging ? 0.9 : 1 }}
                    duration={500}
                    flex={1}
                  >
                    {React.cloneElement(child, { ...child.props, isActive })}
                  </Animate>
                )}
              </View>
            );
          })
        }
      </Draggable>
      {arrows ? (
        <Flex
          absoluteFill
          row={!vertical}
          alignItems="center"
          justifyContent="space-between"
          pointerEvents="box-none"
          {...arrowWrapperProps}
        >
          <Touchable
            onPress={() => swipeToIndex(index - 1)}
            opacity={index > 0 ? 1 : arrowDisabledAlpha}
            key={`arrow-left-${index}`}
          >
            <Icon
              name={vertical ? 'chevron-up' : 'chevron-left'}
              {...arrowProps}
            />
          </Touchable>
          <Touchable
            onPress={() => swipeToIndex(index + 1)}
            opacity={index < items.length - 1 ? 1 : arrowDisabledAlpha}
            key={`arrow-right-${index}`}
          >
            <Icon
              name={vertical ? 'chevron-down' : 'chevron-right'}
              {...arrowProps}
            />
          </Touchable>
        </Flex>
      ) : null}
    </Flex>
  );

  // return (
  //   <Flex
  //     onLayout={onLayout}
  //     w="100%"
  //     overflow="hidden"
  //     opacity={width < 1 ? 0 : 1}
  //     relative
  //     {...rest}
  //   >
  //     <Track
  //       {...bindGesture}
  //       gesture={gesture}
  //       {...itemProps}
  //       style={{
  //         ...(itemProps.style || {}),
  //         height: '100%',
  //         flexDirection: vertical ? 'column' : 'row',
  //         width: vertical ? '100%' : items.length * width,
  //         height: vertical ? items.length * height : '100%',
  //         transform: vertical ? [{ translateY: dist }] : [{ translateX: dist }],
  //       }}
  //       webStyle={{
  //         cursor: 'grab',
  //       }}
  //     >
  //       {items.map((child, i) => {
  //         const isActive = activeIndex === i;
  //         return (
  //           <View
  //             style={{
  //               width: vertical ? '100%' : itemDimension || width,
  //               height: !vertical ? '100%' : itemDimension || height,
  //               paddingRight: !vertical ? gap : 0,
  //               paddingBottom: vertical ? gap : 0,
  //             }}
  //             key={`swiper-${i}`}
  //           >
  //             {!isActive && renderOnActive
  //               ? null
  //               : React.cloneElement(child, { ...child.props, isActive })}
  //           </View>
  //         );
  //       })}
  //     </Track>
  //     {dots ? (
  //       <Dots
  //         items={items}
  //         vertical={vertical}
  //         index={index}
  //         onPress={(index) => setNewIndex(index)}
  //         springConfig={springConfig}
  //         {...{ position: vertical ? 'right' : 'bottom', ...dotsProps }}
  //       />
  //     ) : null}
  //     {arrows ? (
  //       <Flex
  //         absoluteFill
  //         row={!vertical}
  //         alignItems="center"
  //         justifyContent="space-between"
  //         pointerEvents="box-none"
  //         {...arrowWrapperProps}
  //       >
  //         <Touchable
  //           onPress={() => setNewIndex(index - 1)}
  //           opacity={index > 0 ? 1 : arrowDisabledAlpha}
  //           key={`arrow-left-${index}`}
  //         >
  //           <Icon
  //             name={vertical ? 'chevronUp' : 'chevronLeft'}
  //             {...arrowProps}
  //           />
  //         </Touchable>
  //         <Touchable
  //           onPress={() => setNewIndex(index + 1)}
  //           opacity={index < items.length - 1 ? 1 : arrowDisabledAlpha}
  //           key={`arrow-right-${index}`}
  //         >
  //           <Icon
  //             name={vertical ? 'chevronDown' : 'chevronRight'}
  //             {...arrowProps}
  //           />
  //         </Touchable>
  //       </Flex>
  //     ) : null}
  //   </Flex>
  // );
}

export default withThemeProps(forwardRef(Swiper), 'Swiper');
