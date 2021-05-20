import React, { Fragment, useState } from 'react';
import { Platform, ScrollView, Modal } from 'react-native';

import { withThemeProps } from '../../restyle';
import Portal from '../Portal';
import Animate from '../Animate';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Buttons from '../Alert/Buttons';

import { createAnimatedComponent } from '../../spring';
import { useUpdateEffect } from '../../hooks';

const AnimatedScrollView = createAnimatedComponent(ScrollView);

const customStyle = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  top: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  left: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
};

const Overlay = ({
  theme,
  visible = false,
  scrollComp,
  onClose,
  closeButton = true,
  backdrop = true,
  zIndex = 900,
  maxWidth = 600,
  position = 'center',
  children,
  usePortal = true,
  roundness,
  modalSpring = {
    from: { o: 0 },
    to: { o: 1 },
  },
  contentSpring = {
    from: { o: 0, y: 100 },
    to: { o: 1, y: 0 },
  },
  modalProps = {},
  scrollerProps = {},
  contentProps = {},
  ...rest
}) => {
  const [render, setRender] = useState(visible);

  useUpdateEffect(() => {
    if (visible) {
      setRender(true);
    } else {
      setTimeout(() => {
        setRender(false);
      }, 500);
    }
  }, [visible]);

  const AnimatedScrollComp = scrollComp
    ? createAnimatedComponent(scrollComp)
    : AnimatedScrollView;

  const PortalComp = usePortal ? Portal : Fragment;
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
      paddingVertical: 100,
      ...(scrollerProps.contentContainerStyle || {}),
      ...modalStyle,
    },
  };
  return (
    <PortalComp>
      <Modal
        visible={visible}
        animationType="none"
        onRequestClose={onClose}
        transparent
      >
        <Animate
          position={Platform.OS === 'web' ? 'fixed' : 'absolute'}
          left={0}
          top={0}
          right={0}
          bottom={0}
          isVisible={visible === true}
          bg={backdrop ? 'rgba(0,0,0,0.25)' : 'transparent'}
          zIndex={zIndex}
          pointerEvents={visible ? 'auto' : 'none'}
          webStyle={{
            backfaceVisibility: 'hidden',
            backdropFilter: 'blur(1px)',
          }}
          {...modalProps}
          {...modalSpring}
        >
          <AnimatedScrollComp {...scrollableProps}>
            {onClose ? (
              <Touchable onPress={onClose} activeOpacity={1} absoluteFill />
            ) : null}

            <Animate
              isVisible={visible === true}
              relative
              w="90%"
              bg="background"
              useTransition
              delay={50}
              borderRadius={roundness || theme.globals.roundness}
              maxWidth={maxWidth}
              {...contentProps}
              style={{
                ...(contentProps.style ? contentProps.style : {}),
              }}
              {...contentSpring}
            >
              <Flex w="100%" p={theme.globals.gap} {...rest}>
                {render && children}
              </Flex>
              {closeButton ? (
                <Buttons
                  close={onClose}
                  textColor="text"
                  buttons={[
                    {
                      label: theme.translations.close,
                      onPress: (close) => close('onConfirm missing'),
                      clean: true,
                      size: 55,
                    },
                  ]}
                />
              ) : null}
            </Animate>
          </AnimatedScrollComp>
        </Animate>
      </Modal>
    </PortalComp>
  );
};

export default withThemeProps(Overlay, 'Overlay');
