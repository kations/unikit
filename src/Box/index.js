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
  absolute,
  relative,
  w,
  h,
  t,
  r,
  b,
  l,
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

  if (absolute) style["position"] = "absolute";
  if (relative) style["position"] = "relative";

  if (w !== undefined) style["width"] = w;
  if (h !== undefined) style["height"] = h;

  if (t !== undefined) style["top"] = t;
  if (r !== undefined) style["right"] = r;
  if (b !== undefined) style["bottom"] = b;
  if (l !== undefined) style["left"] = l;

  if (p !== undefined) style["padding"] = p;
  if (px !== undefined) style["paddingHorizontal"] = px;
  if (py !== undefined) style["paddingVertical"] = py;
  if (pt !== undefined) style["paddingTop"] = pt;
  if (pb !== undefined) style["paddingBottom"] = pb;
  if (pl !== undefined) style["paddingLeft"] = pl;
  if (pr !== undefined) style["paddingRight"] = pr;

  if (m !== undefined) style["margin"] = m;
  if (mx !== undefined) style["marginHorizontal"] = mx;
  if (my !== undefined) style["marginVertical"] = my;
  if (mt !== undefined) style["marginTop"] = mt;
  if (mb !== undefined) style["marginBottom"] = mb;
  if (ml !== undefined) style["marginLeft"] = ml;
  if (mr !== undefined) style["marginRight"] = mr;

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
    const ssOffset =
      shadowCasting === "top"
        ? -Math.round(shadow / 3)
        : Math.round(shadow / 3);
    const sCololor = shadowColor || theme.colors.shadow;
    const sRadius = interpolate(1, 20, shadow);
    style["elevation"] = shadow;
    style["boxShadow"] = `0 ${ssOffset}px ${sRadius}px ${sCololor}`;
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
