import React from "react";
import color from "color";
import { TextInput, View, Platform, StyleSheet, Text } from "react-native-web";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import Flex from "../primitives/Flex";

const Comp = props => {
  const { children, label, desc, error, style, direction, ...rest } = props;

  const theme = useTheme();

  return (
    <Flex
      flexDirection={direction || "row"}
      alignItems={"center"}
      justifyContent="flex-end"
      backgroundColor={"surface"}
      borderBottomWidth={1}
      borderBottomColor="background"
      marginTop={1}
      height="auto"
      minHeight="55px"
      paddingLeft={15}
      paddingRight={15}
      style={style}
      {...rest}
    >
      <Flex
        paddingTop={direction === "column" ? 10 : 0}
        position="absolute"
        left={15}
        top={18}
      >
        <Text style={{ color: error ? theme.colors.error : theme.colors.text }}>
          {label}
        </Text>
        {desc ? (
          <Text
            style={{ color: color(theme.colors.text).alpha(0.5), fontSize: 10 }}
          >
            {desc}
          </Text>
        ) : null}
      </Flex>
      {children}
    </Flex>
  );
};

export default Comp;
