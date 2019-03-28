import React from "react";
import PropTypes from "prop-types";
import { Text, Platform } from "react-native-web";
const Comp = ({ children, inline, comp, level, ...rest }) => (
  <Text {...rest} aria-level={level} comp={comp || "text"}>
    {children}
  </Text>
);

Comp.propTypes = {
  inline: PropTypes.bool
};

export default Comp;
