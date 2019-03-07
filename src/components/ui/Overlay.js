import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { View, TouchableOpacity, ScrollView } from "react-native";
import PropTypes from "prop-types";
import { useTransition, useSpring, animated } from "react-spring";

import Poral from "../helper/Portal";
import Box from "../primitives/Box";
import Pan from "../helper/Pan";

const Backdrop = styled(View)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  aling-items: center;
  justify-content: center;
`;

const Modal = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
`;

const Panner = styled(Box)`
  position: absolute;
  right: 10px;
  top: 50%;
  margintop: -25px;
  width: 6px;
  height: 50px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const Content = styled(View)`
  flex: 1;
`;

const AnimatedBackdrop = animated(Backdrop);
const AnimatedModal = animated(Modal);
const AnimatedContent = animated(Content);

const Comp = ({
  visible,
  children,
  onClose,
  content,
  backdrop,
  contentMove,
  ...rest
}) => {
  const [state, setState] = useState({
    swipe: false,
    position: visible ? 0 : -300
  });

  useEffect(() => {
    if (visible) {
      setState({ ...state, position: 0 });
    } else {
      setState({ ...state, position: -300 });
    }
  }, [visible]);

  const { position, opacity } = useSpring({
    from: {
      opacity: 0,
      position: -300
    },
    to: {
      opacity: 1,
      position: state.position
    },
    config: { mass: 1, tension: 300, friction: 30 },
    immediate: name => state.swipe
  });

  const autoOpacity = position.interpolate([0, -300], [1, 0]);
  const autoPosition = position.interpolate([0, -300], [300 * contentMove, 0]);

  console.log(position, state);
  return (
    <Poral>
      <Fragment>
        {children && (
          <AnimatedContent style={{ paddingLeft: autoPosition }}>
            {children}
          </AnimatedContent>
        )}
        {backdrop && (
          <AnimatedBackdrop
            as={onClose ? TouchableOpacity : undefined}
            onPress={onClose || null}
            style={{ opacity: autoOpacity }}
            aria-modal="true"
            activeOpacity={0.8}
            pointerEvents={visible ? "auto" : "none"}
          />
        )}
        <Pan
          style={{ paddingRight: 50 }}
          onStart={() => {
            setState({
              ...state,
              swipe: true
            });
          }}
          onSwipe={(direction, gestureState) => {
            let dx = gestureState.dx;
            console.log(gestureState.dx);
            setState({
              ...state,
              position: dx > 0 ? 0 : dx
            });
          }}
          onSwipeEnd={(direction, gestureState) => {
            const threshold = 0;
            const { vy } = gestureState;
            let visible = state.position < -150 ? false : true;

            // Quick movement
            if (Math.abs(vy) * 10 > threshold) {
              if (vy > 0) {
                visible = true;
              } else {
                visible = false;
              }
            }
            if (!visible) onClose();
            setState({
              ...state,
              position: visible ? 0 : -300,
              visible: visible,
              swipe: false
            });
          }}
        >
          <AnimatedModal
            style={{
              transform: position.interpolate(
                p => `translate3d(${p}px, 0px, 0px)`
              )
            }}
            onPress={null}
            activeOpacity={1}
            comp="overlay"
            {...rest}
          >
            <Panner />
            {content && content()}
          </AnimatedModal>
        </Pan>
      </Fragment>
    </Poral>
  );
};

Comp.propTypes = {
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object
};

Comp.defaultProps = {
  backdrop: true,
  from: "left",
  contentMove: 0.5
};

export default Comp;
