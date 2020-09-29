import React, { Fragment, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';

import styled, { withThemeProps } from '../styled';
import { PortalEnter } from '../Portal';
import Animate from '../Animate';

import { createAnimatedComponent } from '../Spring';
import { useUpdateEffect } from '../hooks';

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
};

const BackdropPress = styled.TouchableOpacity(({ zIndex, theme }) => ({
  position: Platform.OS === 'web' ? 'fixed' : 'absolute',
  left: 0,
  bottom: 0,
  top: 0,
  right: 0,
}));

const getId = () => {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

export function Overlay({
  theme,
  visible = false,
  scrollable = false,
  scrollComp,
  onClose,
  backdrop = true,
  zIndex = 900,
  position = 'center',
  children,
  usePortal = true,
  modalSpring = {
    from: { o: 0 },
    to: { o: 1 },
  },
  contentSpring = {
    from: { o: 0, y: 100 },
    to: { o: 1, y: 0 },
  },
  modalProps = {},
  contentProps = {},
}) {
  const [render, setRender] = useState(visible);
  const [id] = useState(() => getId());

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
    : undefined;

  const PortalComp = usePortal ? Fragment : Fragment;
  const modalComp = scrollable
    ? AnimatedScrollComp || AnimatedScrollView
    : undefined;
  const modalStyle = customStyle[position] || {};
  const scrollableProps = scrollable
    ? {
        showsVerticalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        contentContainerStyle: { flexGrow: 1, ...modalStyle },
      }
    : { ...modalStyle };

  if (!render) return null;

  return (
    <PortalComp name={id}>
      <Animate
        as={modalComp}
        absoluteFill
        fixed={Platform.OS === 'web'}
        isVisible={visible}
        bg={backdrop ? 'rgba(0,0,0,0.3)' : 'transparent'}
        zIndex={zIndex}
        pointerEvents={visible ? 'auto' : 'none'}
        useTransition
        delay={50}
        {...modalProps}
        {...scrollableProps}
        {...modalSpring}
      >
        {onClose ? <BackdropPress onPress={onClose} activeOpacity={1} /> : null}

        <Animate
          isVisible={visible}
          relative
          p={theme.globals.gap}
          w="90%"
          bg="background"
          useTransition
          delay={50}
          {...contentProps}
          style={{
            ...(contentProps.style ? contentProps.style : {}),
          }}
          {...contentSpring}
        >
          {children}
        </Animate>
      </Animate>
    </PortalComp>
  );
}

Overlay.propTypes = {
  position: PropTypes.string,
  visible: PropTypes.bool,
  scrollable: PropTypes.bool,
  backdrop: PropTypes.bool,
  usePortal: PropTypes.bool,
  scrollComp: PropTypes.node,
  children: PropTypes.node,
  onClose: PropTypes.func,
  modalSpring: PropTypes.object,
  contentSpring: PropTypes.object,
  modalProps: PropTypes.object,
  contentProps: PropTypes.object,
};

export default withThemeProps(Overlay, 'Overlay');
