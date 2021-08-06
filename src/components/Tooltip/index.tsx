//  @flow

import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TouchableOpacity,
  Modal,
  View,
  I18nManager,
  ScrollView,
} from 'react-native';

import Triangle from './Triangle';
import { ScreenWidth, ScreenHeight, isIOS } from './helpers';
import getTooltipCoordinate from './getTooltipCoordinate';
import Flex from '../Flex';
import Animate from '../Animate';
import { withThemeProps, Touchable } from '../../style';

type Props = {
  withPointer: boolean;
  popover: React.Element | void;
  height: number | string;
  width: number | string;
  containerStyle: any;
  pointerColor: string;
  pointerStyle: {};
  onClose: () => void;
  onOpen: () => void;
  withOverlay: boolean;
  overlayColor: string;
  backgroundColor: string;
  highlightColor: string;
  toggleWrapperProps: {};
  actionType: 'press' | 'longPress' | 'none';
  hover?: boolean;
};

// class Tooltip extends React.Component<Props, State> {
//   state = {
//     isVisible: false,
//     yOffset: 0,
//     xOffset: 0,
//     elementWidth: 0,
//     elementHeight: 0,
//   };

//   renderedElement;
//   timeout;

//   componentDidMount() {
//     // wait to compute onLayout values.
//     this.timeout = setTimeout(this.getElementPosition, 500);
//   }

//   componentWillUnmount() {
//     clearTimeout(this.timeout);
//   }
// }

function Tooltip({
  theme,
  children,
  withPointer = true,
  popover,
  width = 250,
  maxWidth,
  containerStyle = {},
  pointerStyle = {},
  onClose = () => {},
  onOpen = () => {},
  withOverlay = true,
  overlayColor = 'rgba(0,0,0,0.1)',
  color = 'primary',
  highlightColor = 'transparent',
  toggleWrapperProps = {},
  actionType = 'press',
  hover = false,
  useScrollView = false,
  ...rest
}: Props) {
  if (maxWidth && maxWidth < width) width = maxWidth;
  const ref = React.useRef(null);
  const insets = useSafeAreaInsets();
  const [isVisible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState({
    yOffset: 0,
    xOffset: 0,
    elementWidth: 0,
    elementHeight: 0,
  });

  const getElementPosition = () => {
    ref.current &&
      ref.current.measureInWindow((pageOffsetX, pageOffsetY, width, height) => {
        setPosition({
          xOffset: pageOffsetX,
          yOffset: pageOffsetY,
          elementWidth: width,
          elementHeight: height,
        });
      });
  };

  React.useEffect(() => {
    getElementPosition();
  }, [ref.current]);

  const toggleTooltip = () => {
    getElementPosition();
    setVisible((prevState) => {
      if (prevState && !isIOS) {
        onClose && onClose();
      }

      return !prevState;
    });
  };

  const wrapWithAction = (actionType, children) => {
    switch (actionType) {
      case 'press':
        return (
          <Touchable
            onPress={toggleTooltip}
            activeOpacity={1}
            onMouseOver={hover ? () => toggleTooltip() : undefined}
            {...toggleWrapperProps}
          >
            {children}
          </Touchable>
        );
      case 'longPress':
        return (
          <Touchable
            onLongPress={toggleTooltip}
            activeOpacity={1}
            {...toggleWrapperProps}
          >
            {children}
          </Touchable>
        );
      default:
        return children;
    }
  };

  const getTooltipStyle = () => {
    const { yOffset, xOffset, elementHeight, elementWidth } = position;

    const { x, y } = getTooltipCoordinate(
      xOffset,
      yOffset,
      elementWidth,
      elementHeight,
      ScreenWidth,
      ScreenHeight,
      width,
      withPointer
    );

    const pastMiddleLine = yOffset > y;

    const maxHeight = pastMiddleLine
      ? yOffset - 20 - insets.top
      : theme.height - (yOffset + elementHeight + 20 + insets.bottom);
    const tooltipStyle = {
      position: 'absolute',
      left: I18nManager.isRTL ? null : x,
      right: I18nManager.isRTL ? x : null,
      width: width > theme.width ? theme.width - 20 : width,
      maxHeight,
      // default styles
      display: 'flex',
      flex: 1,
      borderRadius: 10,
      ...containerStyle,
    };

    if (pastMiddleLine) {
      tooltipStyle.bottom = ScreenHeight - y;
    } else {
      tooltipStyle.top = y;
    }

    return tooltipStyle;
  };

  const renderPointer = (pastMiddleLine) => {
    const { yOffset, xOffset, elementHeight, elementWidth } = position;

    return (
      <View
        style={{
          position: 'absolute',
          top: pastMiddleLine ? yOffset - 13 : yOffset + elementHeight - 2,
          left: I18nManager.isRTL ? null : xOffset + elementWidth / 2 - 7.5,
          right: I18nManager.isRTL ? xOffset + elementWidth / 2 - 7.5 : null,
        }}
      >
        <Triangle
          bg={color}
          style={{
            borderBottomColor: color,
            ...pointerStyle,
          }}
          isDown={pastMiddleLine}
        />
      </View>
    );
  };

  const renderContent = (withTooltip) => {
    if (!withTooltip) return wrapWithAction(actionType, children);

    const { yOffset, xOffset, elementWidth, elementHeight } = position;
    const tooltipStyle = getTooltipStyle();
    const Wrapper = useScrollView ? ScrollView : View;
    return (
      <>
        <View
          style={{
            position: 'absolute',
            top: yOffset,
            left: I18nManager.isRTL ? null : xOffset,
            right: I18nManager.isRTL ? xOffset : null,
            backgroundColor: highlightColor,
            overflow: 'visible',
            width: elementWidth,
            height: elementHeight,
          }}
          // onMouseLeave={hover ? () => toggleTooltip() : undefined}
        >
          {children}
        </View>
        {withPointer && renderPointer(!tooltipStyle.top)}
        <Touchable
          onPress={() => {}}
          activeOpacity={1}
          bg={color}
          style={tooltipStyle}
          onMouseLeave={hover ? () => toggleTooltip() : undefined}
        >
          <Wrapper
            {...(useScrollView
              ? {
                  style: { flex: 1 },
                  contentContainerStyle: { flexGrow: 1 },
                  showsVerticalScrollIndicator: false,
                }
              : {})}
          >
            <Flex w="100%" collapsed p={10}>
              {popover instanceof Function
                ? popover({ toggleTooltip })
                : popover}
            </Flex>
          </Wrapper>
        </Touchable>
      </>
    );
  };

  return (
    <View collapsable={false} ref={ref}>
      {renderContent(false)}
      <Modal
        animationType="fade"
        visible={isVisible}
        transparent
        onDismiss={onClose}
        onShow={onOpen}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: withOverlay
              ? overlayColor
                ? overlayColor
                : 'rgba(250, 250, 250, 0.70)'
              : 'transparent',
          }}
          onPress={toggleTooltip}
          activeOpacity={1}
        >
          {renderContent(true)}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default withThemeProps(Tooltip, 'Tooltip');
