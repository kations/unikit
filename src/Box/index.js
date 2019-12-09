import styled from "../styled";
import color from "color";
import PropTypes from "prop-types";

const Box = styled.View();

Box.propTypes = {
  type: PropTypes.string,
  lighten: PropTypes.number,
  darken: PropTypes.number,
  alpha: PropTypes.number,
  style: PropTypes.object,
  children: PropTypes.node
};

export default Box;
