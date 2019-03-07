import styled from "styled-components";

import PropTypes from "prop-types";

import Box from "./Box";

const Flex = styled(Box)`
  flex: ${p => (p.inline ? "0" : "1")};
  display: ${p => (p.inline ? "inline-flex" : "flex")};
`;

Flex.propTypes = {
  inline: PropTypes.bool
};

Flex.defaultProps = {
  flex: "1"
};

export default Flex;
