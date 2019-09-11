import color from "color";

export const isDark = colorString => {
  const { r, g, b } = color(colorString)
    .rgb()
    .object();
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 180 ? true : false;
};
