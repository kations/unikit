import React, { useRef, useState, useEffect } from 'react'
import { TouchableOpacity, Text } from "react-native";
import styled, {withTheme} from "styled-components";
import { useTransition } from 'react-spring'

import PropTypes from "prop-types";

import { getProp, getColorSchema } from "../../helper";
import Flex from "../primitives/Flex";

// import styles from "./styles.css";

const Container = styled(Flex)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  align-items: center;
`;

const ButtonText = styled(Text)`
  color: ${p =>
    getColorSchema(
      p,
      getProp(p, 'mode', "button"),
      p.light ? "light" : "background"
    ).text};
  font-size: ${p => getProp(p, "size", "button") / 3}px;
`;

export const messageManager = {
  messageBar: null,
  registerMessageBar(component) {
    this.messageBar = component;
  },
  unregisterMessageBar() {
    this.messageBar = null;
  },
  showMessage(message, config) {
    this.messageBar.pushMessage({ message }, config || {});
  },
};

export const showMessage = messageManager.showMessage.bind(messageManager);


const Comp = (p) => {
  const {
    children,
    style,
    onPress,
    inline,
    activeOpacity,
    disabled,
    ...rest,
  } = p;

  useEffect(() => {
    if (index !== state.index) {
      setState({ ...state, index: index, moveX: index * -state.width });
    }
    if (swipeIndex !== state.swipeIndex) {
      setState({
        ...state,
        swipeIndex: swipeIndex,
        moveX: swipeIndex * -state.width
      });
    }
  }, [index, swipeIndex]);

  const transitions = useTransition(items, item => item.key, {
    from: { opacity: 0, height: 0, life: '100%' },
    enter: item => async next => await next({ opacity: 1, height: refMap.get(item).offsetHeight }),
    leave: item => async (next, cancel) => {
      cancelMap.set(item, cancel)
      await next({ life: '0%' })
      await next({ opacity: 0 })
      await next({ height: 0 })
    },
    onRest: item => setItems(state => state.filter(i => i.key !== item.key)),
    config: (item, state) => (state === 'leave' ? [{ duration: timeout }, config, config] : config),
  })
  
  return (
    <Container
    >
      <ButtonText {...rest}>
        {children}
      </ButtonText>
    </Container>
  );
};

Comp.propTypes = {
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node.isRequired
};

export default withTheme(Comp);