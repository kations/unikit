import React from "react";
import { TouchableOpacity } from "react-native";

import Box from "../Box";
import Flex from "../Flex";
import Icon from "../Icon";

import TextInput from "./Text";

const Comp = props => {
  const { style, onChange, value, step, ...rest } = props;

  return (
    <Box relative w="100%" style={style}>
      <Flex
        as={TouchableOpacity}
        absolute
        t="0px"
        r="0px"
        type="background"
        row
        h="80%"
        px={5}
        style={{
          borderRadius: 20,
          zIndex: 10
        }}
      >
        <Flex
          as={TouchableOpacity}
          onPress={() => {
            if (onChange) onChange(value - step);
          }}
          w={38}
          h="100%"
          align="center"
          content="center"
          style={{ borderRightWidth: 2, borderRightColor: "#FFF" }}
        >
          <Icon size={15} name="minus" />
        </Flex>
        <Flex
          as={TouchableOpacity}
          onPress={() => {
            if (onChange) onChange(value + step);
          }}
          w={38}
          h="100%"
          align="center"
          content="center"
        >
          <Icon size={15} name="plus" />
        </Flex>
      </Flex>
      <TextInput
        keyboardType="numeric"
        value={value}
        onChange={onChange}
        {...rest}
      />
    </Box>
  );
};

export default Comp;
