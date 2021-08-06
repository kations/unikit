import * as React from "react";
import { ScrollView, Modal } from "react-native";
import Animated from "react-native-reanimated";

import { styled, withThemeProps, Pressable } from "../../style";
import { isWeb } from "../../util";

import Animate from "../Animate";
import Flex from "../Flex";
import Icon from "../Icon";
import Button from "../Button";

const Touchable = styled.Touchable();

import { useUpdateEffect, useLayout } from "../../hooks";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const customStyle = {
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  top: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  left: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  right: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
};

const defaultSprings = ({ width, height }) => ({
  fadeInUp: {
    from: { opacity: 0, y: height },
    to: { opacity: 1, y: 0 },
  },
  slideInRight: {
    from: { x: -300 },
    to: { x: 0 },
  },
  height: {
    from: { opacity: 0, height: 0 },
    to: { opacity: 1, height },
  },
  scale: {
    from: { scale: 0 },
    to: { scale: 1 },
  },
});

const Overlay = ({
  theme,
  visible = false,
  scrollComp,
  onClose,
  backdrop = true,
  backdropColor = "rgba(0,0,0,0.25)",
  zIndex = 900,
  maxWidth = 600,
  position = "center",
  paddingVertical = 50,
  scroll = true,
  x,
  y,
  children,
  renderHeader = null,
  usePortal = true,
  roundness,
  modalSpring = {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  contentSpring = "fadeInUp",
  modalProps = {},
  scrollerProps = {},
  contentProps = {},
  closeButton = true,
  closeButtonProps = {},
  ...rest
}) => {
  const { width, height, onLayout } = useLayout();
  const [render, setRender] = React.useState(visible);

  if (typeof contentSpring === "string") {
    contentSpring =
      defaultSprings({ width, height })[contentSpring] ||
      defaultSprings({ width, height })[0];
  }

  useUpdateEffect(() => {
    if (visible === true) {
      setRender(true);
    } else if (visible === false && !isWeb) {
      setRender(false);
    }
  }, [visible]);

  const AnimatedScrollComp = scrollComp
    ? createAnimatedComponent(scrollComp)
    : AnimatedScrollView;

  const modalStyle = customStyle[position] || {};
  const scrollableProps = {
    ...scrollerProps,
    bounces: false,
    style: {
      flex: 1,
      ...(scrollerProps.style || {}),
    },
    showsVerticalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
      flexGrow: 1,
      paddingVertical,
      ...(scrollerProps.contentContainerStyle || {}),
      ...modalStyle,
    },
  };

  const renderContent = (
    <Animate
      duration={750}
      visible={visible}
      relative
      w={100}
      useTransition
      delay={50}
      borderRadius={roundness || theme.globals.roundness}
      maxWidth={maxWidth}
      {...contentProps}
      style={{
        ...(contentProps.style ? contentProps.style : {}),
      }}
      onDidAnimate={(ani) => {
        if (ani.state === "exit") {
          setRender(false);
        }
      }}
      {...contentSpring}
    >
      <Flex w="100%">
        <Flex w="100%" p={theme.globals.gap} onLayout={onLayout} {...rest}>
          {render && children}
        </Flex>
      </Flex>
      {closeButton ? (
        <Button
          bg={backdropColor}
          size={44}
          w={44}
          px={0}
          rounded
          onPress={onClose}
          t={-50}
          r={0}
          borderRadius={22}
          absolute
          center
          {...closeButtonProps}
        >
          <Icon name="x" color="#FFF" size={24} />
        </Button>
      ) : null}
    </Animate>
  );

  return (
    <Modal
      visible={render}
      animationType="none"
      onRequestClose={() => setRender(false)}
      transparent
    >
      {backdrop ? (
        <Animate
          visible={visible}
          bg={backdropColor}
          absoluteFill
          {...modalSpring}
        >
          {onClose ? (
            <Touchable onPress={onClose} activeOpacity={1} absoluteFill />
          ) : null}
          {renderHeader}
        </Animate>
      ) : null}

      <Flex
        fixed
        left={x || 0}
        top={y || 0}
        right={0}
        bottom={0}
        pointerEvents="box-none"
        bg="red"
        {...modalProps}
      >
        {scroll ? (
          <AnimatedScrollComp {...scrollableProps}>
            {onClose ? (
              <Touchable onPress={onClose} activeOpacity={1} absoluteFill />
            ) : null}

            {renderContent}
          </AnimatedScrollComp>
        ) : (
          renderContent
        )}
      </Flex>
    </Modal>
  );
};

export default withThemeProps(Overlay, "Overlay");
