import React, { Children } from "react";
import * as PropTypes from "prop-types";

import styled from "../styled";

const Group = styled.View(({ theme }) => ({
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "stretch",
  borderRadius: theme.globals.roundness,
  overflow: "hidden"
}));

const getBorderRadius = (index, length) => {
  if (index === 0) {
    return {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    };
  } else if (index === length - 1) {
    return {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    };
  } else {
    return {
      borderRadius: 0
    };
  }
};

export default function ButtonGroup({
  children,
  gap = 1,
  buttonStyle = {},
  ...rest
}) {
  return (
    <Group {...rest}>
      {Children.map(children, (child, i) => {
        if (child) {
          return React.cloneElement(child, {
            style: {
              flex: 1,
              marginLeft: i === 0 ? 0 : gap,
              marginTop: gap,
              ...getBorderRadius(i, React.Children.count(children)),
              ...buttonStyle
            }
          });
        }
      })}
    </Group>
  );
}

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  gap: PropTypes.number,
  buttonStyle: PropTypes.object
};
