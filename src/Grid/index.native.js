import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled, { withThemeProps } from '../styled';
import { useLayout } from '../hooks';

const GridWrap = styled.View({
  position: 'relative',
  //flexDirection: "row",
  //flexWrap: "wrap",
});

const Row = styled.View({
  position: 'relative',
  flexDirection: 'row',
  //flexWrap: "wrap",
});

const GridItem = styled.View();

function chunkArray(array = [], size) {
  if (array === []) return [];
  return array.reduce((acc, val) => {
    if (acc.length === 0) acc.push([]);
    const last = acc[acc.length - 1];
    if (last.length < size) {
      last.push(val);
    } else {
      acc.push([val]);
    }
    return acc;
  }, []);
}

function fillArray(array = [], size, comp) {
  if (array.length === size) return array;
  const newArray = [...array];
  for (var i = 0; i < newArray.length; i++) {
    const num = newArray.length / size;
    if (num % 1 !== 0) {
      newArray.push(comp);
    }
  }
  return newArray;
}

const Grid = withThemeProps(
  ({
    children,
    min = 250,
    gap = 5,
    outerGap = false,
    itemStyle = {},
    rowStlye = {},
    numColumns,
    ...rest
  }) => {
    const { onLayout, width } = useLayout();

    numColumns = numColumns || Math.max(1, Math.floor(width / min));

    const gridProps = {
      onLayout,
      p: outerGap ? gap / 2 : 0,
      opacity: width > 0 ? 1 : 0,
    };

    const rows = React.useMemo(
      () => chunkArray(React.Children.toArray(children), numColumns),
      [children, numColumns]
    );

    return (
      <GridWrap wrap {...gridProps} {...rest}>
        {rows.map((row, index) => {
          row = fillArray(
            row,
            numColumns,
            <View
              key={`${index}`}
              style={{
                flex: 1,
              }}
            />
          );
          return (
            <Row key={`${index}`} {...rowStlye}>
              {row.map((child, i) => {
                return (
                  <GridItem
                    key={`${i}`}
                    style={{
                      paddingRight: (i + 1) % numColumns === 0 ? 0 : gap,
                      paddingBottom: index === rows.length - 1 ? 0 : gap,
                      flex: 1,
                    }}
                    {...itemStyle}
                  >
                    {child}
                  </GridItem>
                );
              })}
            </Row>
          );
        })}
      </GridWrap>
    );
  },
  'Grid'
);

Grid.propTypes = {
  children: PropTypes.node,
  min: PropTypes.number,
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
