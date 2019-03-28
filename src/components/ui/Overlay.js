import React, { useState, useEffect, Fragment } from "react";
import {
  Dimensions,
  Platform,
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native-web";
import PropTypes from "prop-types";
import { useTransition, useSpring, animated } from "react-spring";

import { useTheme } from "../../style/Theme";
import Portal from "../helper/Portal";
import Box from "../primitives/Box";
import Pan from "../helper/Pan";

const AnimatedContent = animated(View);
const AnimatedPan = animated(Pan);

const getMove = (position, width, height) => {
  if (position === "left") {
    return -width;
  } else if (position === "right") {
    return width;
  } else if (position === "top") {
    return -height;
  } else if (position === "bottom") {
    return height;
  }
};

const Comp = props => {
  const {
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
    ...rest
  } = props;
  const Screen = Dimensions.get("window");

  const theme = useTheme();
  const { back, pan, modal, handle, contents } = defaultStyle(props, theme);

  const [state, setState] = useState({
    width: width || Screen.width,
    height: height || Screen.height,
    swipe: false,
    move: visible ? 0 : getMove(position, Screen.width, Screen.height)
  });

  useEffect(() => {
    if (visible) {
      setState({ ...state, move: 0 });
    } else {
      setState({
        ...state,
        move: getMove(position, state.width, state.height)
      });
    }
  }, [visible]);

  const { move, opacity } = useSpring({
    from: {
      opacity: 0,
      move: getMove(position, state.width, state.height)
    },
    to: {
      opacity: 1,
      move: state.move
    },
    config: { mass: 1, tension: 300, friction: 30 },
    immediate: name => state.swipe && name === "move"
  });

  const autoOpacity = move.interpolate(
    [0, getMove(position, state.width, state.height)],
    [1, 0]
  );
  const autoPosition = move.interpolate(
    [0, getMove(position, state.width, state.height)],
    [getMove(position, state.width, state.height) * contentMove, 0]
  );

  var contentStyle = `padding${position.charAt(0).toUpperCase() +
    position.slice(1)}`;

  const AnimatedBackdrop = animated(onClose ? TouchableOpacity : View);

  return (
    <Portal>
      <Fragment>
        {children && (
          <AnimatedContent
            style={contents}
            modalPosition={position}
            contentMoveStyle={contentMoveStyle}
            move={autoPosition}
          >
            {children}
          </AnimatedContent>
        )}
        {backdrop && (
          <AnimatedBackdrop
            onPress={onClose || null}
            style={StyleSheet.flatten([back, { opacity: autoOpacity }])}
            aria-modal="true"
            activeOpacity={0.8}
            pointerEvents={visible ? "auto" : "none"}
          />
        )}
        <AnimatedPan
          onLayout={({ nativeEvent }) => {
            console.log({ width: nativeEvent.layout.width });
            setState({
              ...state,
              width: nativeEvent.layout.width,
              height: nativeEvent.layout.height
            });
          }}
          style={StyleSheet.flatten([
            pan,
            {
              width: width,
              height: height,
              transform: move.interpolate(m => [{ translateX: m }])
            }
          ])}
          onStart={() => {
            setState({
              ...state,
              swipe: true
            });
          }}
          onSwipe={(direction, gestureState) => {
            const { dx, dy } = gestureState;
            console.log(gestureState, dx, dy);
            setState({
              ...state,
              move: position === "top" || position === "bottom" ? dy : dx
            });
          }}
          onSwipeEnd={(direction, gestureState) => {
            const threshold = 0;
            const { vx, vy } = gestureState;
            var visible =
              state.move < getMove(position, state.width, state.height) / 2
                ? false
                : true;

            if (position === "right" || position === "bottom") {
              visible =
                state.move > getMove(position, state.width, state.height) / 2
                  ? false
                  : true;
            }

            // Quick movement
            if (Math.abs(vx) * 10 > threshold) {
              if (
                (vx > 0 && position === "left") ||
                (vx < 0 && position === "right") ||
                (vy < 0 && position === "top") ||
                (vy < 0 && position === "bottom")
              ) {
                visible = true;
              } else {
                visible = false;
              }
            }
            if (!visible && onClose) onClose();
            setState({
              ...state,
              move: visible ? 0 : getMove(position, state.width, state.height),
              visible: visible,
              swipe: false
            });
          }}
        >
          <Box
            style={modal}
            onPress={null}
            activeOpacity={1}
            comp="overlay"
            {...rest}
          >
            <Box style={handle} />
            {content && content()}
          </Box>
        </AnimatedPan>
      </Fragment>
    </Portal>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    back: {
      position: Platform.OS === "web" ? "fixed" : "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      zIndex: props.zIndex
    },
    pan: {
      position: Platform.OS === "web" ? "fixed" : "absolute",
      left: props.position !== "right" ? "0px" : "auto",
      right: props.position === "right" ? "0px" : "auto",
      bottom: props.position === "bottom" ? "0px" : "auto",
      top: props.position !== "bottom" ? "0px" : "auto",
      backgroundColor: "#000",
      zIndex: props.zIndex + 10
    },
    modal: {
      backgroundColor: "#fff",
      width: "100%",
      height: "100%"
    },
    handle: {
      position: "absolute",
      right: 10,
      top: "50%",
      width: 6,
      height: 50,
      borderRadius: 5,
      backgroundColor: "rgba(0, 0, 0, 0.1)"
    },
    contents: {
      flex: 1
    }
  });

Comp.propTypes = {
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object
};

Comp.defaultProps = {
  contentMoveStyle: "transform",
  backdrop: true,
  position: "bottom",
  contentMove: 0.5,
  zIndex: 100
};

export default Comp;
