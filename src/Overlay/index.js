import React, { Fragment, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { useTransition, animated } from "react-spring";
import PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";
import { PortalEnter } from "../Portal";

const Modal = animated(
  styled.View(({ zIndex, backdrop }) => ({
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: backdrop ? "rgba(0,0,0,0.2)" : "transparent",
    zIndex: zIndex
  }))
);

const ModalContent = animated(
  styled.View(({ zIndex, theme }) => ({
    position: "relative",
    width: "100%",
    height: "auto",
    backgroundColor: theme.colors.background
  }))
);

const customStyle = {
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  bottom: {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  top: {
    justifyContent: "flex-start",
    alignItems: "center"
  }
};

const BackdropPress = styled.TouchableOpacity(({ zIndex, theme }) => ({
  position: Platform.OS === "web" ? "fixed" : "absolute",
  left: 0,
  bottom: 0,
  top: 0,
  right: 0
}));

const getId = () => {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

export function Overlay({
  visible = false,
  scrollable = false,
  scrollComp,
  onClose,
  backdrop = true,
  zIndex = 900,
  position = "center",
  children,
  usePortal = true,
  modalSpring = {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: item => async (next, cancel) => {
      await new Promise(resolve => setTimeout(resolve, 250));
      await next({ opacity: 0 });
    }
  },
  contentSpring = {
    from: { opacity: 0, top: 100 },
    enter: item => async (next, cancel) => {
      await new Promise(resolve => setTimeout(resolve, 250));
      await next({ opacity: 1, top: 0 });
    },
    leave: { opacity: 0, top: 100 },
    unique: true
  },
  modalProps = {},
  contentProps = {}
}) {
  const [id] = useState(() => getId());
  const mTransition = useTransition(visible, null, modalSpring);
  const cTransition = useTransition(visible, null, contentSpring);

  const PortalComp = usePortal ? PortalEnter : Fragment;
  const modalComp = scrollable ? scrollComp || ScrollView : undefined;
  const modalStyle = customStyle[position] || {};
  const scrollableProps = scrollable
    ? {
        showsVerticalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        contentContainerStyle: { flexGrow: 1, ...modalStyle }
      }
    : {};

  return (
    <PortalComp name={id}>
      {mTransition.map(({ item, key, props }) =>
        item ? (
          <Modal
            as={modalComp}
            key={key}
            zIndex={zIndex}
            backdrop={backdrop}
            {...modalProps}
            style={{
              ...props,
              ...(modalProps.style ? modalProps.style : {}),
              ...(!scrollable ? modalStyle : {})
            }}
            pointerEvents={visible ? "auto" : "none"}
            {...scrollableProps}
          >
            {onClose ? (
              <BackdropPress onPress={onClose} activeOpacity={1} />
            ) : null}
            {cTransition.map(({ item, key, props }) =>
              item ? (
                <ModalContent
                  key={key}
                  {...contentProps}
                  style={{
                    ...props,
                    ...(contentProps.style ? contentProps.style : {})
                  }}
                >
                  {children}
                </ModalContent>
              ) : null
            )}
          </Modal>
        ) : null
      )}
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
  contentProps: PropTypes.object
};

export default withThemeProps(Overlay, "Overlay");
