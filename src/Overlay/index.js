import React, { useState, useEffect, Fragment } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";

import styled, { useTheme, withThemeProps } from "../styled";
import { PortalEnter } from "../Portal";
import { isIphoneX } from "../util";

const safePan = {
  bottom: {
    paddingTop: 20,
    paddingBottom: isIphoneX() ? 30 : 0
  },
  center: {},
  left: {
    paddingRight: 20
  },
  right: {
    paddingLeft: 20
  },
  top: {
    paddingBottom: 20,
    paddingTop: isIphoneX() ? 30 : 0
  }
};

const flexStyle = {
  bottom: {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  top: {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  left: {
    justifyContent: "center",
    alignItems: "flex-start"
  },
  right: {
    justifyContent: "center",
    alignItems: "flex-end"
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
};

const panStyle = {
  bottom: {
    top: 10,
    left: "50%",
    width: 50,
    height: 7,
    marginLeft: -25
  },
  center: {
    top: 10,
    left: "50%",
    width: 50,
    height: 7,
    marginLeft: -25
  },
  left: {
    right: 10,
    top: "50%",
    width: 7,
    height: 50,
    marginTop: -25
  },
  right: {
    left: 10,
    top: "50%",
    width: 7,
    height: 50,
    marginTop: -25
  },
  top: {
    bottom: 10,
    left: "50%",
    width: 50,
    height: 7,
    marginLeft: -25
  }
};

const Overlay = animated(
  styled.View(({ theme, overlayPosition, zIndex }) => ({
    width: "100%",
    height: "100%",
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    bottom: 0,
    zIndex: zIndex + 10,
    ...flexStyle[overlayPosition]
  }))
);

const OverlayContent = styled.View(
  ({ theme, roundness, width, height, overlayPosition }) => ({
    position: "relative",
    width,
    height,
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: roundness || theme.globals.roundness,
    ...safePan[overlayPosition]
  })
);

const Backdrop = animated(
  styled.View(({ zIndex, theme }) => ({
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: zIndex + 5
  }))
);

const BackdropPress = styled.TouchableOpacity(({ zIndex, theme }) => ({
  position: Platform.OS === "web" ? "fixed" : "absolute",
  left: 0,
  bottom: 0,
  top: 0,
  right: 0
}));

const Pan = styled.View(({ overlayPosition }) => ({
  position: "absolute",
  backgroundColor: "background",
  borderRadius: 4,
  ...panStyle[overlayPosition]
}));

const getId = () => {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

const Comp = ({
  width = "100%",
  height,
  position = "center",
  visible,
  children,
  onClose,
  content,
  backdrop = true,
  contentMove,
  contentMoveStyle,
  containerStyle,
  usePan = false,
  shadow = 15,
  overlayContentProps,
  backdropProps = {},
  roundness,
  zIndex = 5000,
  portal = true,
  config = {},
  ...rest
}) => {
  const theme = useTheme();
  const [show, set] = useState(visible);
  const [id] = useState(() => getId());

  useEffect(() => {
    set(visible);
  }, [visible]);

  const moves = {
    bottom: theme.screen ? theme.screen.height : 0,
    center: theme.screen ? 200 : 0,
    top: theme.screen ? -theme.screen.height : 0,
    left: theme.screen ? -theme.screen.width : 0,
    right: theme.screen ? theme.screen.width : 0
  };

  const move = moves[position];

  const transitions = useTransition(show, null, {
    from: {
      opacity: 0,
      move: move || 500 //moves[position]
    },
    enter: { opacity: 1, move: 0 },
    leave: {
      opacity: 0,
      move: move || 500 //moves[position]
    },
    config
  });

  const PortalComp = portal ? PortalEnter : Fragment;

  return (
    <PortalComp name={id}>
      {backdrop
        ? transitions.map(
            ({ item, key, props }) =>
              item && (
                <Backdrop
                  key={key}
                  zIndex={zIndex}
                  {...backdropProps}
                  style={{
                    opacity: props.opacity,
                    ...(backdropProps.style ? backdropProps.style : {})
                  }}
                  pointerEvents={show ? "auto" : "none"}
                >
                  <BackdropPress onPress={onClose} activeOpacity={1} />
                </Backdrop>
              )
          )
        : null}
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <Overlay
              key={key}
              style={{
                opacity: position === "center" ? props.opacity : 1,
                transform: props.move.interpolate(m =>
                  position === "top" ||
                  position === "bottom" ||
                  position === "center"
                    ? [{ translateY: m }]
                    : [{ translateX: m }]
                )
              }}
              overlayPosition={position}
              pointerEvents={"box-none"}
              zIndex={zIndex}
            >
              <OverlayContent
                bg="surface"
                width={width || theme.width}
                height={height || theme.height}
                pointerEvents={show ? "auto" : "none"}
                overlayPosition={position}
                shadow={shadow}
                roundness={roundness}
                {...rest}
              >
                {usePan ? <Pan overlayPosition={position} /> : null}
                {children}
              </OverlayContent>
            </Overlay>
          )
      )}
    </PortalComp>
  );
};

const ThemeComp = withThemeProps(Comp, "Overlay");

ThemeComp.propTypes = {
  overlayContentProps: PropTypes.object,
  backdropProps: PropTypes.object,
  style: PropTypes.object
};

export default ThemeComp;
