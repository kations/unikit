import React from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";
import Box from "../Box";

const Txt = styled.Text(({ theme }) => ({
  fontFamily: theme.globals.fontFamily,
  color: "text"
}));

const Touchable = styled.TouchableOpacity();

export function Text({ children, level, font, ...rest }) {
  if (!level && !font) {
    font = "p";
  }

  return (
    <Box
      as={rest.onPress ? Touchable : Txt}
      aria-level={level}
      level={level}
      font={level && !font ? `h${level}` : font}
      {...Platform.select({
        web: {
          ...(level ? { "aria-level": `${level}` } : {}),
          accessibilityRole: level ? "heading" : rest.href ? "link" : "text"
        },
        default: {
          accessibilityRole: rest.href ? "link" : "text"
        }
      })}
      {...rest}
    >
      {children}
    </Box>
  );
}

Text.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node,
  font: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.object
};

export default withThemeProps(Text, "Text");
