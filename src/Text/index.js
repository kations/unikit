import React from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";
import Box from "../Box";
import { isDark } from "../util";

const Txt = styled.Text(({ theme }) => ({
  fontFamily: theme.globals.fontFamily
}));

const Touchable = styled.TouchableOpacity();

export function Text({
  theme,
  children,
  level,
  font,
  bgAware,
  color = "text",
  ...rest
}) {
  if (!level && !font) {
    font = "p";
  }

  if (bgAware) {
    color = isDark(theme.colors[bgAware] || bgAware) ? "#FFF" : "#000";
  }

  return (
    <Box
      as={rest.onPress ? Touchable : Txt}
      aria-level={level}
      level={level}
      font={level && !font ? `h${level}` : font}
      color={color}
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
