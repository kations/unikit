import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { View } from "react-native";
import PropTypes from "prop-types";
import { useTransition, useSpring, animated } from "react-spring";

import Button from "../Button";
import Poral from "../Portal";

const Backdrop = styled(View)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  aling-items: center;
  justify-content: center;
`;

const Modal = styled(View)`
  padding: 100px;
  display: inline-block;
  background-color: #fff;
`;

const AnimatedBackdrop = animated(Backdrop);
const AnimatedModal = animated(Modal);

const Comp = ({ visible, onClose }) => {
  const [isVisible, setVisible] = useState(visible || false);

  const transitions = useTransition(isVisible, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const { top, opacity } = useSpring({
    to: { opacity: isVisible ? 1 : 0, top: isVisible ? 0 : 150 }
  });

  useEffect(() => {
    setVisible(visible);
  }, [visible]);

  console.log(transitions);
  return (
    <Poral>
      <Button onPress={() => setVisible(!isVisible)}>Show</Button>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <AnimatedBackdrop
              key={key}
              style={{ opacity: props.opacity }}
              aria-modal="true"
            >
              <AnimatedModal
                style={{ opacity: opacity, transform: [{ translateX: top }] }}
              >
                <Button onPress={() => setVisible(!isVisible)}>Hide</Button>
              </AnimatedModal>
            </AnimatedBackdrop>
          )
      )}
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

export default Comp;
