import React from "react";
import { Platform } from "react-native";

import styled from "../styled";
import Box from "../Box";

const accessibilityRoles = [
  "button",
  "header",
  "heading",
  "label",
  "link",
  "listitem",
  "none",
  "text"
];

const Txt = styled.Text(({ theme }) => ({
  fontFamily: theme.globals.fontFamily,
  color: "text"
}));

export default function Text({ children, level, font, ...rest }) {
  const getAccessibilityRole = font => {
    return accessibilityRoles.indexOf(font) > -1 ? font : "text";
  };
  if (!level && !font) {
    font = "p";
  }
  return (
    <Box
      as={Txt}
      aria-level={level}
      accessibilityRole={
        Platform.OS === "web"
          ? level
            ? "heading"
            : getAccessibilityRole(font)
          : undefined
      }
      level={level}
      font={level && !font ? `h${level}` : font}
      {...rest}
    >
      {children}
    </Box>
  );
}
