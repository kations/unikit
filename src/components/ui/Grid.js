import React, { Children, useState, useEffect } from "react";
import styled from "../../style/styled";
import { useTheme } from "../../style/Theme";

const Grid = styled.View(({ theme, gap }) => ({
  width: "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  padding: gap / 2
}));

const GridItem = styled.View(({ width, gap, i }) => ({
  width: `${width}%`,
  flexBasis: `${width}%`,
  padding: gap / 2
}));

export default ({
  children,
  min = 500,
  maxRows = 3,
  gap = 5,
  style,
  itemStyle
}) => {
  const theme = useTheme();
  const [width, setWidth] = useState(theme.width || 0);
  const [rowWidth, setRowWidth] = useState(theme.width || 0);

  useEffect(() => {
    if (width) {
      const rows = width / min > maxRows ? maxRows : Math.round(width / min);
      const rowWidth = 100 / rows;
      setRowWidth(rowWidth);
    }
  }, [width]);

  return (
    <Grid
      onLayout={({ nativeEvent: { layout } }) => {
        setWidth(layout.width);
      }}
      gap={gap}
      style={style}
    >
      {Children.map(children, (child, i) => {
        if (child) {
          return (
            <GridItem
              key={i}
              i={i}
              width={rowWidth}
              gap={gap}
              style={itemStyle}
            >
              {child}
            </GridItem>
          );
        }
      })}
    </Grid>
  );
};
