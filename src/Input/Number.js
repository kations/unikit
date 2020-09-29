import React, { useState } from "react";

import { useTheme } from "../styled";
import Box from "../Box";
import Flex from "../Flex";
import Icon from "../Icon";
import Button from "../Button";
import Group from "../Group";

import TextInput from "./Text";

import { isNumber } from "../util";

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

const Comp = ({ style, onChange, value, defaultValue, step = 1, ...rest }) => {
  const theme = useTheme();

  const [stringValue, setValue] = useState(
    () =>
      `${
        value !== undefined && isNumber(value)
          ? value === 0
            ? "0"
            : value
          : ""
      }`
  );

  const changeValue = (type) => {
    if (onChange) {
      const def = type === "add" ? 1 : 0;
      step = type === "add" ? -step : step;
      let newValue =
        isNaN(value) === false && value !== null && value !== undefined
          ? isFloat(value)
            ? parseFloat(value) - step
            : parseInt(value) - step
          : def;
      onChange(newValue);
      setValue(newValue.toString());
    }
  };

  return (
    <Box
      relative
      w="100%"
      style={style}
      borderRadius={theme.globals.roundness}
      {...rest}
    >
      <TextInput
        keyboardType="decimal-pad"
        autoCapitalize="words"
        value={stringValue}
        onChange={(text) => {
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
      />
      <Box w={100} h="100%" p={theme.globals.inputGap / 2} absolute t={0} r={0}>
        <Group w="100%" h="100%" gap={2}>
          <Button
            light
            p={0}
            h="100%"
            onPress={() => {
              changeValue("remove");
            }}
          >
            <Icon size={20} name="minus" />
          </Button>
          <Button
            light
            p={0}
            h="100%"
            onPress={() => {
              changeValue("add");
            }}
          >
            <Icon size={20} name="plus" />
          </Button>
        </Group>
      </Box>
    </Box>
  );
};

export default Comp;
