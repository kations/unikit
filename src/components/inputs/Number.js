import React from "react";
import { Platform, TouchableOpacity } from "react-native";

import Box from "../primitives/Box";
import Flex from "../primitives/Flex";
import Icon from "../ui/Icon";

import TextInput from "./TextInput";

const Comp = props => {
  const { style, onChange, value, step, ...rest } = props;

  return (
    <Box width="100%" position="relative" style={style}>
      <Flex
        as={TouchableOpacity}
        position="absolute"
        top="10%"
        right={0}
        backgroundColor="background"
        flexDirection="row"
        height="80%"
        paddingHorizontal={5}
        borderRadius={20}
        zIndex={10}
      >
        <Flex
          as={TouchableOpacity}
          onPress={() => {
            onChange(value - step);
          }}
          width={34}
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={15} type="minus" />
        </Flex>
        <Flex
          as={TouchableOpacity}
          onPress={() => {
            onChange(value + step);
          }}
          width={34}
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={15} type="plus" />
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

Comp.defaultProps = {
  step: 1
};

export default Comp;
