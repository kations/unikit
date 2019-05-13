import React, { useState, Fragment, useEffect } from "react";
import { Platform, Text, StyleSheet } from "react-native-web";
import { useSpring, useTransition, useSprings, animated } from "react-spring";

import Icon from "../ui/Icon";
import Flex from "../primitives/Flex";
import Box from "../primitives/Box";
import { useTheme } from "../../style/Theme";

const Message = animated(Box);
let id = 0;

const Comp = props => {
  const { alert, timeout = 3000 } = props;

  const theme = useTheme();
  const [items, setItems] = useState([]);
  const { container, message, text } = defaultStyle(props, theme);

  const transitions = useTransition(items, items => items.key, {
    from: { opacity: 0, top: 30 },
    enter: { opacity: 1, top: 0 },
    leave: { opacity: 0, top: 30 },
    onRest: item =>
      setTimeout(() => {
        setItems(state => state.filter(i => i.key !== item.key));
      }, timeout)
  });

  useEffect(() => {
    if (alert) {
      setItems(state => [
        ...state,
        { key: id++, message: alert.message, type: alert.type }
      ]);
    }
  }, [alert]);

  return (
    <Box style={container}>
      {transitions.map(({ item, props, key }) => (
        <Message key={key} style={props} width="100%" alignItems="center">
          <Flex
            style={message}
            backgroundColor={item.type || "surface"}
            shadow={5}
          >
            {/* <Box style={{ right: life }} /> */}
            <Text style={text}>{item.message}</Text>
            <Icon
              position="absolute"
              top={17}
              right={15}
              size={20}
              color="surface"
              onPress={e => {
                e.stopPropagation();
                setItems(state => state.filter(i => i.key !== item.key));
              }}
            />
          </Flex>
        </Message>
      ))}
    </Box>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    container: {
      position: Platform.OS === "web" ? "fixed" : "absolute",
      right: 0,
      bottom: 0,
      width: "100%",
      zIndex: props.zIndex,
      paddingHorizontal: 15
    },
    message: {
      maxWidth: 400,
      width: "100%",
      padding: 20,
      marginBottom: 10
    },
    text: {
      color: "#fff"
    }
  });

Comp.defaultProps = {
  min: 0,
  max: 100,
  steps: 1,
  ticks: 10,
  showValue: true,
  timeout: 2000
};

export default Comp;
