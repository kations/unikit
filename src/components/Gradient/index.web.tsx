import * as React from "react";
import { withThemeProps } from "../../style";
import Flex from "../Flex";

const parseColors = (colors, theme) => {
  const parsedColors = [];
  colors.map((c) => {
    const color = theme.colors[c] || c;
    parsedColors.push(color);
  });
  return parsedColors;
};

interface Props {
  theme: object;
  colors: string[];
  style: object;
  deg: number;
  [key: string]: any;
}

export const Gradient = ({
  colors,
  theme,
  style,
  deg = 90,
  ...rest
}: Props) => {
  if (!colors) colors = theme.colors.gradient;
  const parsedColors = React.useMemo(
    () => parseColors(colors, theme),
    [colors]
  );

  return (
    <Flex
      height="100%"
      width="100%"
      overflow="hidden"
      style={{
        ...style,
        backgroundImage: `linear-gradient(${deg}deg, ${parsedColors.join(
          ","
        )})`,
      }}
      {...rest}
    />
  );
};

export default withThemeProps(Gradient, "Gradient");
