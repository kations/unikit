import * as React from 'react';

import { withThemeProps } from '../../style';
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

interface Props {
  theme: object;
  children: React.ReactNode;
  gap?: number;
  vertical?: boolean;
  roundness?: number;
  [key: string]: any;
}

const Group = ({
  children,
  theme,
  gap = 0,
  vertical = false,
  roundness,
  ...rest
}: Props) => {
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
              ...child.props.style,
              flex: vertical ? undefined : 1,
              marginLeft: i === 0 ? 0 : vertical ? 0 : gap,
              marginTop: i === 0 ? 0 : vertical ? gap : 0,
              ...getBorderRadius(i, items.length, vertical),
            },
          });
        }
      })}
    </Flex>
  );
};

export default withThemeProps(Group, 'Group');
