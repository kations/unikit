import React, { useState, Fragment, useEffect } from "react";
import { Platform, SafeAreaView } from "react-native";
import { useTransition, animated } from "react-spring/native";
import * as PropTypes from "prop-types";

import styled, { useTheme } from "../styled";
import Icon from "../Icon";
import { isDark, isIphoneX } from "../util";
import Box from "../Box";

const Container = styled.View(({ from, gap }) => ({
  position: Platform.OS === "web" ? "fixed" : "absolute",
  left: 0,
  bottom: from === "bottom" ? 0 : "auto",
  top: from === "top" ? 0 : "auto",
  width: "100%",
  zIndex: 500,
  paddingHorizontal: gap,
  paddingVertical: isIphoneX() ? gap / 2 + 25 : gap / 2
}));

const Message = animated(
  styled(Box)(({ theme, gap, maxWidth }) => ({
    flexBasis: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: gap / 2,
    width: "100%",
    maxWidth: maxWidth,
    alignSelf: "center",
    borderRadius: theme.globals.roundness
  }))
);

const Text = styled.Text(({ color }) => ({
  maxWidth: 400,
  width: "100%",
  padding: 20,
  color: color
}));

let id = 0;

export default function Alert({
  alert,
  timeout = 2000,
  from = "top",
  gap = 15,
  maxWidth = 700,
  ...rest
}) {
  const theme = useTheme();
  const [items, setItems] = useState([]);

  const transitions = useTransition(items, items => items.key, {
    from: { opacity: 0, top: from === "bottom" ? 30 : -30 },
    enter: { opacity: 1, top: 0 },
    leave: { opacity: 0, top: from === "bottom" ? 30 : -30 },
    onRest: item =>
      setTimeout(() => {
        setItems(state => state.filter(i => i.key !== item.key));
      }, timeout)
  });

  useEffect(() => {
    if (alert) {
      if (from === "bottom") {
        setItems(state => [
          ...state,
          { key: id++, message: alert.message, type: alert.type }
        ]);
      } else {
        setItems(state => [
          { key: id++, message: alert.message, type: alert.type },
          ...state
        ]);
      }
    }
  }, [alert, from]);

  return (
    <Container from={from} gap={gap} pointerEvents="box-none" {...rest}>
      {from === "top" ? <SafeAreaView collapsable={false} /> : null}
      {transitions.map(({ item, props, key }) => (
        <Message
          bg={item.type || "surface"}
          key={key}
          style={props}
          from={from}
          gap={gap}
          maxWidth={maxWidth}
          shadow={3}
        >
          <Text
            color={
              isDark(theme.colors[item.type || "surface"]) ? "#FFF" : "#000"
            }
          >
            {item.message}
          </Text>
          <Icon
            name="x"
            style={{
              position: "absolute",
              top: 17,
              right: 15
            }}
            size={20}
            color={
              isDark(theme.colors[item.type || "surface"]) ? "#FFF" : "#000"
            }
            onPress={e => {
              e.stopPropagation();
              setItems(state => state.filter(i => i.key !== item.key));
            }}
          />
        </Message>
      ))}
      {/* {from === "bottom" ? <SafeAreaView collapsable={false} /> : null} */}
    </Container>
  );
}

Alert.propTypes = {
  alert: PropTypes.object,
  timeout: PropTypes.number,
  from: PropTypes.string,
  gap: PropTypes.number,
  maxWidth: PropTypes.number
};
