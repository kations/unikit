import styled from "../styled";
import color from "color";

const getStyle = ({ theme, type, lighten, darken }) => {
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

    style["backgroundColor"] = col;
  }

  return style;
};

const Box = styled.View(props => ({
  ...getStyle(props)
}));

export default Box;
