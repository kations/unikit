import React from "react";
import { Platform } from "react-native-web";
import PropTypes from "prop-types";

import Box from "./Box";

const Block = ({ children, inline, ...rest }) => (
  <Box
    display={
      Platform.OS === "web" ? (inline ? "inline-block" : "block") : "flex"
    }
    {...rest}
  >
    {children}
  </Box>
);

Block.propTypes = {
  inline: PropTypes.bool
};

export default Block;
