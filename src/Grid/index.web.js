import React from "react";
import PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";

const GridWrap = styled.View(({ gap, min, max }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), ${
    max || "1fr"
  }))`,
  gridColumnGap: gap,
  gridRowGap: gap,
}));

const GridItem = styled.View({
  width: `100%`,
  maxWidth: "100%",
});

const Grid = withThemeProps(
  ({
    children,
    min = 250,
    max,
    gap = 5,
    outerGap = false,
    itemStyle = {},
    ...rest
  }) => {
    const gridProps = { gap, min, max, p: outerGap ? gap : 0 };

    return (
      <GridWrap w={"auto"} {...gridProps} {...rest}>
        {React.Children.toArray(children).map((child, i) => {
          if (child) {
            return (
              <GridItem key={i} style={itemStyle}>
                {child}
              </GridItem>
            );
          }
        })}
      </GridWrap>
    );
  },
  "Grid"
);

Grid.propTypes = {
  children: PropTypes.node,
  min: PropTypes.number,
  max: PropTypes.number,
  gap: PropTypes.number,
  outerGap: PropTypes.bool,
  itemStyle: PropTypes.object,
};

Grid.defaultPropTypes = {
  min: 250,
  gap: 5,
  outerGap: false,
  itemStyle: {},
};

export default Grid;
