import React from "react";
import { Platform } from "react-native";

import styled from "../styled";
import Box from "../Box";

const Txt = styled.Text(({ fontSize, color, level }) => ({
  fontSize: level ? `h${level}` : fontSize || "p",
  color: color || "text"
}));

export default function Text({ children, level, ...rest }) {
  return (
    <Box
      as={Txt}
      aria-level={level}
      accessibilityRole={Platform.OS === "web" && level ? "heading" : undefined}
      level={level}
      {...rest}
    >
      {children}
    </Box>
  );
}
