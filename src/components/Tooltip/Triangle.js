//  @flow

import React from "react";
import { View, StyleSheet } from "react-native";

import Flex from "../Flex";

type Props = {
  style: any,
  isDown: boolean,
};

const Triangle = ({ style, isDown, dots = true, bg }: Props) => {
  if (dots === true) {
    return (
      <Flex
        transform={[
          { rotate: !isDown ? "180deg" : "0deg" },
          { translateY: !isDown ? 3 : -3 },
        ]}
        center
      >
        <Flex bg={bg} w={12} h={8} borderRadius={55} mb={2} />
        <Flex bg={bg} w={8} h={5} borderRadius={55} mb={2} />
        <Flex bg={bg} w={6} h={4} borderRadius={55} />
      </Flex>
    );
  }
  return <View style={[styles.triangle, style, isDown ? styles.down : {}]} />;
};

const styles = StyleSheet.create({
  down: {
    transform: [{ rotate: "180deg" }],
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
  },
});

export default Triangle;
