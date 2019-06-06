import React from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";

import Box from "./Box";

class Flex extends React.PureComponent {
  render() {
    const { inline, ...rest } = this.props;

    return React.createElement(Box, {
      display:
        Platform.OS === "web" ? (inline ? "inline-flex" : "flex") : "flex",
      ...rest
    });
  }
}

Flex.propTypes = {
  inline: PropTypes.bool
};

export default Flex;
