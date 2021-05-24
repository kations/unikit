import React from 'react';

import { withThemeProps } from '../../style';
import Flex from '../Flex';

interface Props {
  children: React.ReactNode;
  min: number;
  theme: object;
  gap: number;
  outerGap: boolean;
  itemStyle: object;
  rowStlye: object;
  numColumns?: number;
  [key: string]: any;
}

const Grid = ({
  children,
  min = 250,
  max,
  gap = 5,
  outerGap = false,
  itemStyle = {},
  ...rest
}: Props) => {
  const gridProps = { gap, min, max, p: outerGap ? gap : 0 };

  return (
    <Flex
      {...gridProps}
      style={{
        width: '100%',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), ${
          max || '1fr'
        }))`,
        gridColumnGap: gap,
        gridRowGap: gap,
        ...(gridProps.style || {}),
      }}
      {...rest}
    >
      {React.Children.toArray(children).map((child, i) => {
        if (child) {
          return (
            <Flex
              key={i}
              style={{ width: `100%`, maxWidth: '100%', ...itemStyle }}
            >
              {child}
            </Flex>
          );
        }
      })}
    </Flex>
  );
};

export default withThemeProps(Grid, 'Grid');
