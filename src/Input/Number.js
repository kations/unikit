import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import Box from "../Box";
import Flex from "../Flex";
import Icon from "../Icon";

import TextInput from "./Text";

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

const Comp = props => {
  const [stringValue, setValue] = useState((props.value || "").toString());
  const { style, onChange, value, step = 1, ...rest } = props;

  return (
    <Box relative w="100%" style={style}>
      <Flex
        as={TouchableOpacity}
        absolute
        t="0px"
        r="0px"
        bg="background"
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
            if (onChange) {
              let newValue =
                isNaN(value) === false && value !== null && value !== undefined
                  ? isFloat(value)
                    ? parseFloat(value) - step
                    : parseInt(value) - step
                  : 0;
              onChange(newValue);
              setValue(newValue.toString());
            }
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
            if (onChange) {
              let newValue =
                isNaN(value) === false && value !== null && value !== undefined
                  ? isFloat(value)
                    ? parseFloat(value) + step
                    : parseInt(value) + step
                  : 1;
              onChange(newValue);
              setValue(newValue.toString());
            }
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
        value={stringValue}
        onChange={text => {
          if (!isNaN(text) && text.toString().indexOf(".") !== -1) {
            onChange(parseFloat(text));
          } else if (!isNaN(text)) {
            onChange(parseInt(text));
          } else if (text.length === 0) {
            onChange(null);
          }
          if (text.length === 0 || !isNaN(text)) {
            setValue(text);
          }
        }}
        {...rest}
      />
    </Box>
  );
};

export default Comp;
