import * as React from "react";

import Flex from "../Flex";
import Text from "../Text";

export default ({
  keys,
  keyProps,
  width,
  color,
  strokeWidth,
  legendOffset = 15,
  ...rest
}) => {
  return (
    <Flex w="100%" justifyContent="center" mt={legendOffset} wrap row>
      {keys.map((key) => {
        const props = keyProps[key] || {};

        return (
          <Flex mx={5} row alignItems="center">
            <Flex
              width={10}
              h={props.type === "bar" ? 10 : strokeWidth}
              bg={props.color || color}
              mr={5}
            />
            <Text font="label">{props.label || key}</Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
