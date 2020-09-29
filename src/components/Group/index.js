import React, { Children } from 'react';

import { withThemeProps } from '../../restyle';
import Flex from '../Flex';

const getBorderRadius = (index, length, vertical) => {
  if (length === 1) return {};
  if (index === 0) {
    if (vertical) {
      return {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      };
    }
    return {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    };
  } else if (index === length - 1) {
    if (vertical) {
      return {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
      };
    }
    return {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    };
  } else {
    return {
      borderRadius: 0,
    };
  }
};

const Group = ({
  children,
  theme,
  gap = 0,
  buttonStyle = {},
  vertical = false,
  roundness,
  ...rest
}) => {
  const items = React.Children.toArray(children);
  return (
    <Flex
      row={vertical ? false : true}
      h="auto"
      justifyContent="space-between"
      alignItems="flex-start"
      borderRadius={roundness || theme.globals.roundness}
      {...rest}
    >
      {items.map((child, i) => {
        if (child) {
          return React.cloneElement(child, {
            ...child.props,
            roundness: roundness || theme.globals.roundness,
            style: {
              flex: vertical ? undefined : 1,
              marginLeft: i === 0 ? 0 : vertical ? 0 : gap,
              marginTop: i === 0 ? 0 : vertical ? gap : 0,
              ...getBorderRadius(i, items.length, vertical),
              ...buttonStyle,
              ...child.props.style,
            },
          });
        }
      })}
    </Flex>
  );
};

export default withThemeProps(Group, 'Group');
