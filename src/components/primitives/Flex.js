import React from "react";
import { Platform } from "react-native-web";
import PropTypes from "prop-types";

import Box from "./Box";

const Flex = ({ children, inline, ...rest }) => (
  <Box
    display={Platform.OS === "web" ? (inline ? "inline-flex" : "flex") : "flex"}
    {...rest}
  >
    {children}
  </Box>
);

Flex.propTypes = {
  inline: PropTypes.bool
};

export default Flex;
