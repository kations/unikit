import React, { Children, useState, useEffect } from "react";

import styled, { useTheme, withThemeProps } from "../styled";
import Box from "../Box";
import { useLayout } from "../hooks";

const GridWrap = styled(Box)(({ theme }) => ({
  position: "relative",
  flexDirection: "row",
  flexWrap: "wrap"
}));

const GridItem = styled.View(({ rowWidth, gap, noRightGap, noBottomGap }) => ({
  width: `${rowWidth}%`,
  flexBasis: `${rowWidth}%`
}));

function Grid({
  children,
  min = 250,
  maxCols = 50,
  minCols = 1,
  gap = 5,
  outerGap = false,
  itemStyle = {},
  ...rest
}) {
  const { onLayout, width } = useLayout();
  const [columns, setColumns] = useState(() => Math.floor(width / min));
  const [colWidth, setColWidth] = useState(100);
  useEffect(() => {
    let columns = Math.floor(width / min);
    if (columns < minCols) columns = minCols;
    if (columns > maxCols) columns = maxCols;
    const colWidth = 100 / columns;
    setColumns(columns);
    setColWidth(colWidth);
  }, [width]);

  return (
    <GridWrap
      onLayout={onLayout}
      p={outerGap ? gap / 2 : 0}
      ml={outerGap ? 0 : -gap / 2}
      mr={outerGap ? 0 : -gap / 2}
      w={"auto"}
      {...rest}
    >
      {React.Children.toArray(children).map((child, i) => {
        if (child) {
          return (
            <GridItem
              key={i}
              p={gap / 2}
              rowWidth={colWidth}
              gap={gap}
              style={itemStyle}
            >
              {child}
            </GridItem>
          );
        }
      })}
    </GridWrap>
  );
}

export default withThemeProps(Grid, "Grid");
