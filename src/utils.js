import { Box, Button, Overlay } from "./";

// const defaultComponents = {
//   Box,
//   Button,
//   Overlay
// };

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

function calculateDimensions({
  min,
  staticDimension,
  totalDimension,
  fixed,
  spacing,
  maxItems
}) {
  const usableTotalDimension = staticDimension || totalDimension;
  const availableDimension = usableTotalDimension - spacing; // One spacing extra
  const itemTotalDimension = Math.min(min + spacing, availableDimension); // itemTotalDimension should not exceed availableDimension
  var itemsPerRow = Math.floor(availableDimension / itemTotalDimension);
  if (maxItems && itemsPerRow > maxItems) {
    itemsPerRow = maxItems;
  }
  const containerDimension = availableDimension / itemsPerRow;

  let fixedSpacing;
  if (fixed) {
    fixedSpacing = (totalDimension - min * itemsPerRow) / (itemsPerRow + 1);
  }

  return {
    itemTotalDimension,
    availableDimension,
    itemsPerRow,
    containerDimension,
    fixedSpacing
  };
}

function generateStyles({
  itemDimension,
  containerDimension,
  spacing,
  fixed,
  horizontal,
  fixedSpacing
}) {
  let rowStyle = {
    flexDirection: "row",
    paddingLeft: fixed ? fixedSpacing : spacing,
    paddingBottom: spacing
  };

  let containerStyle = {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: fixed ? itemDimension : containerDimension - spacing,
    marginRight: fixed ? fixedSpacing : spacing
  };

  if (horizontal) {
    rowStyle = {
      flexDirection: "column",
      paddingTop: fixed ? fixedSpacing : spacing,
      paddingRight: spacing
    };

    containerStyle = {
      flexDirection: "row",
      justifyContent: "center",
      height: fixed ? itemDimension : containerDimension - spacing,
      marginBottom: fixed ? fixedSpacing : spacing
    };
  }

  return {
    containerStyle,
    rowStyle
  };
}

function getComponents(overrides) {
  return Object.keys(defaultComponents).reduce((acc, name) => {
    const override = overrides[name] || {};
    acc[name] = {
      component: override.component || defaultComponents[name],
      props: override
    };
    return acc;
  }, {});
}

export { chunkArray, calculateDimensions, generateStyles, getComponents };
