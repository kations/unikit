import React, { Children, useState, useEffect } from "react";

import styled, { useTheme } from "../styled";
import Box from "../Box";

const Grid = styled(Box)(({ theme, gap, w }) => ({
  width: w || "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  padding: gap
}));

const GridItem = styled.View(({ rowWidth, gap, noRightGap, noBottomGap }) => ({
  width: `${rowWidth}%`,
  flexBasis: `${rowWidth}%`,
  paddingRight: noRightGap ? 0 : gap,
  paddingBottom: noBottomGap ? 0 : gap
}));

export default ({
  children,
  min = 500,
  maxRows,
  minRows = 1,
  gap = 5,
  gridGap,
  itemStyle = {},
  ...rest
}) => {
  const theme = useTheme();
  const [width, setWidth] = useState(theme.width || 0);
  const [rowWidth, setRowWidth] = useState(theme.width || 0);
  const [rowCount, setRowCount] = useState(0);

  const childCount = Children.count(children);
  const rows = Math.ceil(childCount / rowCount);

  useEffect(() => {
    if (width) {
      let rowCount = Math.floor(width / min);
      if (rowCount > childCount && min <= width) {
        rowCount = childCount;
      }
      if (maxRows && rowCount > maxRows) {
        rowCount = maxRows;
      }
      if (minRows && rowCount < minRows) {
        rowCount = minRows;
      }
      const rowWidth = 100 / rowCount;
      setRowWidth(rowWidth);
      setRowCount(rowCount);
    }
  }, [width, children]);

  return (
    <Grid
      onLayout={({ nativeEvent: { layout } }) => {
        setWidth(layout.width);
      }}
      gap={gridGap !== undefined ? gridGap : gap}
      {...rest}
    >
      {React.Children.toArray(children).map((child, i) => {
        if (child) {
          var row = Math.ceil((i + 1) / rowCount);
          var noRightGap = false;
          var noBottomGap = false;
          if (((i + 1) / rowCount) % 1 === 0) {
            noRightGap = true;
          }
          if (row === rows) {
            noBottomGap = true;
          }
          return (
            <GridItem
              key={i}
              noRightGap={noRightGap}
              noBottomGap={noBottomGap}
              rowWidth={rowWidth}
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
