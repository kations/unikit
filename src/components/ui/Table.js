import React from "react";
import { StyleSheet } from "react-native-web";
import PropTypes from "prop-types";

import { useTheme } from "../../style/Theme";
import { getProp, getObjValue } from "../../helper";
import Box from "../primitives/Box";
import Flex from "../primitives/Flex";
import Text from "../primitives/Text";

const isOdd = num => {
  return num % 2;
};

const Comp = props => {
  const { keys, data, style, even, ...rest } = props;
  const theme = useTheme();
  const { row, head, item, label } = defaultStyle(props, theme);
  return (
    <Box style={StyleSheet.flatten([row, style])} {...rest}>
      <Flex style={row}>
        {keys &&
          keys.map(key => (
            <Flex style={head} key={`${key}-head`}>
              <Text style={label}>{key}</Text>
            </Flex>
          ))}
      </Flex>
      {data &&
        data.map((item, index) => (
          <Flex style={row}>
            {keys.map(key => (
              <Flex
                style={item}
                key={`${key}-${index}-body`}
                index={index}
                even={even}
              >
                <Text style={label}>{getObjValue(item, key)}</Text>
              </Flex>
            ))}
          </Flex>
        ))}
    </Box>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    row: {
      alignSelf: "stretch",
      flexDirection: "row"
    },
    head: {
      alignSelf: "stretch",
      flexDirection: "row",
      padding: 15,
      backgroundColor: getProp(p, "headBackground", "table")
    },
    item: {
      alignSelf: "stretch",
      flexDirection: "row",
      padding: 15,
      backgroundColor:
        getProp(p, "even", "table") === true && isOdd(p.index) === 0
          ? "transparent"
          : getProp(p, "bodyBackground", "table")
    },
    label: {
      alignSelf: "stretch",
      flexDirection: "row"
    }
  });

Comp.propTypes = {
  keys: PropTypes.array,
  data: PropTypes.array,
  style: PropTypes.object,
  headBackground: PropTypes.string,
  bodyBackground: PropTypes.string,
  even: PropTypes.bool
};

export default Comp;
