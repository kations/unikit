import React, { Children, useState, useEffect } from "react";

import styled, { useTheme } from "../styled";
import Box from "../Box";

const Grid = styled(Box)(({ theme, gap, w }) => ({
  width: w || "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  padding: gap / 2
}));

const GridItem = styled.View(({ rowWidth, gap }) => ({
  width: `${rowWidth}%`,
  flexBasis: `${rowWidth}%`,
  padding: gap / 2
}));

export default ({
  children,
  min = 500,
  maxRows,
  minRows = 1,
  gap = 5,
  style = {},
  itemStyle = {},
  ...rest
}) => {
  const theme = useTheme();
  const [width, setWidth] = useState(theme.width || 0);
  const [rowWidth, setRowWidth] = useState(theme.width || 0);

  useEffect(() => {
    if (width) {
      let rowCount = Math.ceil(width / min);
      if (rowCount > Children.count(children) && min <= width) {
        rowCount = Children.count(children);
      }
      if (maxRows && rowCount > maxRows) {
        rowCount = maxRows;
      }
      if (minRows && rowCount < minRows) {
        rowCount = minRows;
      }
      const rowWidth = 100 / rowCount;
      setRowWidth(rowWidth);
    }
  }, [width]);

  return (
    <Grid
      onLayout={({ nativeEvent: { layout } }) => {
        setWidth(layout.width);
      }}
      gap={gap}
      {...rest}
    >
      {Children.map(children, (child, i) => {
        if (child) {
          return (
            <GridItem key={i} rowWidth={rowWidth} gap={gap} style={itemStyle}>
              {child}
            </GridItem>
          );
        }
      })}
    </Grid>
  );
};
