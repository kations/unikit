import styled from "styled-components";

import PropTypes from "prop-types";

import Box from "./Box";

const Block = styled(Box)`
  display: ${p => (p.inline ? "inline-block" : "block")};
`;

Block.propTypes = {
  inline: PropTypes.bool
};

export default Block;
