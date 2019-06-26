import React, { Children, useState, useEffect } from "react";
import styled from "../../style/styled";

const Grid = styled.View(({ theme, gap }) => ({
  width: "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  padding: gap / 2
}));

const GridItem = styled.View(({ width, gap, i }) => ({
  width: `${width}%`,
  padding: gap / 2,
  backgroundColor: "#000"
}));

export default ({
  children,
  min = 500,
  maxRows = 3,
  gap = 5,
  style,
  itemStyle
}) => {
  const [width, setWidth] = useState(0);
  const [rowWidth, setRowWidth] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    const rows = width / min > maxRows ? maxRows : Math.round(width / min);
    const rowWidth = 100 / rows;
    setRows(rows);
    setRowWidth(rowWidth);
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
        return (
          <GridItem key={i} i={i} width={rowWidth} gap={gap} style={itemStyle}>
            {child}
          </GridItem>
        );
      })}
    </Grid>
  );
};
