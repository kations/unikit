import React, { useState, useEffect, Fragment } from "react";
import { Platform, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";

import { useTheme } from "../../style/Theme";
import Portal from "../helper/Portal";
import styled from "../../style/styled";
import { isIphoneX } from "../../helper";

const safePan = {
  bottom: {
    paddingTop: 20,
    paddingBottom: isIphoneX() && 30
  },
  center: {
    paddingTop: 20
  },
  left: {
    paddingRight: 20
  },
  right: {
    paddingLeft: 20
  },
  top: {
    paddingBottom: 20,
    paddingTop: isIphoneX() && 30
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
    width: theme.width,
    height: theme.height,
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    bottom: 0,
    zIndex: zIndex + 10,
    ...flexStyle[overlayPosition]
  }))
);

const OverlayContent = styled.View(({ width, height, overlayPosition }) => ({
  position: "relative",
  backgroundColor: "surface",
  width,
  height,
  maxHeight: "100%",
  maxWidth: "100%",
  ...safePan[overlayPosition]
}));

const Backdrop = animated(
  styled.View(({ zIndex, theme }) => ({
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    bottom: 0,
    width: theme.width,
    height: theme.height,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: zIndex + 5
  }))
);

const Pan = styled.View(({ overlayPosition }) => ({
  position: "absolute",
  backgroundColor: "background",
  borderRadius: 4,
  ...panStyle[overlayPosition]
}));

const Comp = ({
  width,
  height,
  position,
  visible,
  children,
  onClose,
  content,
  backdrop,
  contentMove,
  contentMoveStyle,
  containerStyle,
  usePan,
  shadow,
  overlayContentProps,
  backdropProps,
  style,
  zIndex = 100,
  portal = true,
  ...rest
}) => {
  const theme = useTheme();
  const [show, set] = useState(visible);

  useEffect(() => {
    set(visible);
  }, [visible]);

  const moves = {
    bottom: theme.height,
    center: theme.height,
    top: -theme.height,
    left: -theme.width,
    right: theme.width
  };

  const transitions = useTransition(show, null, {
    from: {
      opacity: 0,
      move: moves[position]
    },
    enter: { opacity: 1, move: 0 },
    leave: {
      opacity: 0,
      move: moves[position]
    }
  });

  const PortalComp = portal ? Portal : Fragment;

  return (
    <PortalComp>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <Fragment key={key}>
              {backdrop ? (
                <TouchableOpacity onPress={onClose} activeOpacity={0.9}>
                  <Backdrop
                    zIndex={zIndex}
                    style={{
                      opacity: props.opacity
                    }}
                    pointerEvents={"none"}
                    {...backdropProps}
                  />
                </TouchableOpacity>
              ) : null}
              <Overlay
                style={{
                  ...style,
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
                {...rest}
              >
                <OverlayContent
                  width={width || theme.width}
                  height={height || theme.height}
                  pointerEvents={show ? "auto" : "none"}
                  overlayPosition={position}
                  shadow={shadow}
                  {...overlayContentProps}
                >
                  <Pan overlayPosition={position} />
                  {children}
                </OverlayContent>
              </Overlay>
            </Fragment>
          )
      )}
    </PortalComp>
  );
};

Comp.propTypes = {
  overlayContentProps: PropTypes.object,
  backdropProps: PropTypes.object,
  style: PropTypes.object
};

Comp.defaultProps = {
  backdrop: true,
  position: "bottom",
  usePan: false,
  shadow: 5
};

export default Comp;
