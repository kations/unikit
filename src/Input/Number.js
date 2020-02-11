import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import styled, { useTheme } from "../styled";

import Box from "../Box";
import Flex from "../Flex";
import Icon from "../Icon";

import TextInput from "./Text";

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

const Comp = props => {
  const theme = useTheme();
  const [stringValue, setValue] = useState(
    (props.value && !isNaN(props.value) ? props.value : "").toString()
  );
  const { style, onChange, value, step = 1, ...rest } = props;

  return (
    <Box relative w="100%" style={style}>
      <TextInput
        keyboardType="decimal-pad"
        autoCapitalize="words"
        value={stringValue}
        onChange={text => {
          var number;
          text = text.replace(",", ".");
          if (!isNaN(text) && text.toString().indexOf(".") !== -1) {
            number = parseFloat(text);
          } else if (!isNaN(text)) {
            number = parseInt(text);
          }
          if (text.length === 0) {
            number = null;
          }
          setValue(text);
          if (number === undefined) return;
          if (number === NaN) return;
          onChange(number);
        }}
        {...rest}
      />
      <Flex p={theme.globals.inputGap / 2} h="100%" t={0} r={0} absolute>
        <Flex
          bg="background"
          row
          h="100%"
          style={{
            borderRadius: theme.globals.roundness,
            zIndex: 50
          }}
        >
          <Flex
            as={TouchableOpacity}
            onPress={() => {
              if (onChange) {
                let newValue =
                  isNaN(value) === false &&
                  value !== null &&
                  value !== undefined
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
            style={{
              borderRightWidth: 2,
              borderRightColor: theme.colors.surface
            }}
          >
            <Icon size={22} name="minus" />
          </Flex>
          <Flex
            as={TouchableOpacity}
            onPress={() => {
              if (onChange) {
                let newValue =
                  isNaN(value) === false &&
                  value !== null &&
                  value !== undefined
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
            <Icon size={22} name="plus" />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Comp;
