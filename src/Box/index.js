import styled from "../styled";
import color from "color";
import PropTypes from "prop-types";

const getStyle = ({ theme, type, lighten, darken, alpha }) => {
  const style = {};

  if (type) {
    let col = theme.colors[type] || type;

    if (lighten) {
      col = color(col)
        .lighten(lighten)
        .toString();
    }

    if (darken) {
      col = color(col)
        .darken(darken)
        .toString();
    }

    if (alpha) {
      col = color(col)
        .alpha(alpha)
        .toString();
    }

    style["backgroundColor"] = col;
  }

  return style;
};

const Box = styled.View(props => ({
  ...getStyle(props)
}));

Box.propTypes = {
  type: PropTypes.string,
  lighten: PropTypes.number,
  darken: PropTypes.number,
  alpha: PropTypes.number,
  style: PropTypes.object,
  children: PropTypes.node
};

export default Box;
