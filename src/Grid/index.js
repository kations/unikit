import React, { Children, useState, useEffect } from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";

import styled, { useTheme, withThemeProps } from "../styled";
import { useLayout } from "../hooks";

const GridWrap = styled.View(({ gap, min }) => ({
  native: {
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  web: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))`,
    gridColumnGap: gap,
    gridRowGap: gap
  }
}));

const GridItem = styled.View(({ rowWidth }) => ({
  native: {
    width: `${rowWidth}%`,
    flexBasis: `${rowWidth}%`
  },
  web: {
    width: `100%`,
    maxWidth: "100%"
  }
}));

export function Grid({
  children,
  min = 250,
  maxCols = 50,
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
    if (columns < 1) columns = 1;
    if (columns > maxCols) columns = maxCols;
    const colWidth = 100 / columns;
    setColumns(columns);
    setColWidth(colWidth);
  }, [width]);

  const gridProps =
    Platform.OS !== "web"
      ? {
          onLayout,
          ml: outerGap ? 0 : -gap / 2,
          mr: outerGap ? 0 : -gap / 2,
          p: outerGap ? gap / 2 : 0
        }
      : { gap, min, p: outerGap ? gap : 0 };

  const itemProps =
    Platform.OS !== "web"
      ? {
          p: gap / 2,
          rowWidth: colWidth
        }
      : {};

  return (
    <GridWrap w={"auto"} {...gridProps} {...rest}>
      {React.Children.toArray(children).map((child, i) => {
        if (child) {
          return (
            <GridItem key={i} style={itemStyle} {...itemProps}>
              {child}
            </GridItem>
          );
        }
      })}
    </GridWrap>
  );
}

Grid.propTypes = {
  children: PropTypes.node,
  min: PropTypes.number,
  maxCols: PropTypes.number,
  gap: PropTypes.number,
  outerGap: PropTypes.bool,
  itemStyle: PropTypes.object
};

export default withThemeProps(Grid, "Grid");
