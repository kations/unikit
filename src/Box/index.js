import styled from "../styled";
import color from "color";
import PropTypes from "prop-types";

const interpolate = (min, max, value) => {
  var theVariable = value * 3; // 1 to 100
  var distance = max - min;
  var position = min + (theVariable / 100) * distance;
  return position;
};

const getStyle = ({
  theme,
  type,
  shadow,
  shadowColor,
  shadowCasting = "bottom",
  lighten,
  darken,
  alpha,
  w,
  h,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr
}) => {
  const style = {};

  if (w) style["width"] = w;
  if (h) style["height"] = h;

  if (p) style["padding"] = p;
  if (px) style["paddingHorizontal"] = px;
  if (py) style["paddingVertical"] = py;
  if (pt) style["paddingTop"] = pt;
  if (pb) style["paddingBottom"] = pb;
  if (pl) style["paddingLeft"] = pl;
  if (pr) style["paddingRight"] = pr;

  if (m) style["margin"] = m;
  if (mx) style["marginHorizontal"] = mx;
  if (my) style["marginVertical"] = my;
  if (mt) style["marginTop"] = mt;
  if (mb) style["marginBottom"] = mb;
  if (ml) style["marginLeft"] = ml;
  if (mr) style["marginRight"] = mr;

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

  if (shadow) {
    let shadowOffset = Math.round(shadow / 2);
    style["shadowColor"] = shadowColor || theme.colors.shadow;
    style["shadowOffset"] = {
      width: 0,
      height: shadowCasting === "top" ? -shadowOffset : shadowOffset
    };
    style["shadowRadius"] = interpolate(1, 20, shadow);
    style["elevation"] = shadow;
  }

  //console.log({ style });

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
