import React from "react";
import styled from "styled-components";
import { Text } from "react-native";
import PropTypes from "prop-types";

import Block from "./Block";

export default ({ children, comp, ...rest }) => (
  <Block as={Text} {...rest} comp={comp || "text"}>
    {children}
  </Block>
);
