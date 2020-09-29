import styled from "../styled";
import PropTypes from "prop-types";

import { styles } from "../styles";

const Box = styled.View();

const StyleProps = {};
Object.keys(styles).map((key) => {
  const { type } = styles[key];
  if (type) {
    StyleProps[key] = type;
  }
});

Box.propTypes = {
  bg: PropTypes.string,
  lighten: PropTypes.number,
  darken: PropTypes.number,
  alpha: PropTypes.number,
  absoluteFill: PropTypes.bool,
  absolute: PropTypes.bool,
  fixed: PropTypes.bool,
  relative: PropTypes.bool,
  sticky: PropTypes.bool,
  ...StyleProps,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Box;
