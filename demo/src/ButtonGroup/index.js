import React, { Children } from "react";
import * as PropTypes from "prop-types";

import styled from "../styled";
import Flex from "../Flex";

const Group = styled(Flex)(({ theme }) => ({
  width: "100%",
  height: "auto",
  justifyContent: "space-between",
  alignItems: "stretch",
  borderRadius: theme.globals.roundness,
  overflow: "hidden"
}));

const getBorderRadius = (index, length, vertical) => {
  if (index === 0) {
    if (vertical) {
      return {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      };
    }
    return {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    };
  } else if (index === length - 1) {
    if (vertical) {
      return {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0
      };
    }
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
  vertical = false,
  ...rest
}) {
  return (
    <Group row={vertical ? false : true} {...rest}>
      {Children.map(children, (child, i) => {
        if (child) {
          return React.cloneElement(child, {
            style: {
              flex: vertical ? undefined : 1,
              marginLeft: i === 0 ? 0 : gap,
              marginTop: gap,
              ...getBorderRadius(i, React.Children.count(children), vertical),
              ...buttonStyle,
              ...child.props.style
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
