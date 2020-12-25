import * as React from 'react';

import { withThemeProps } from '../../restyle';
import { useLayout } from '../../hooks';
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
  gap = 5,
  outerGap = false,
  itemStyle = {},
  rowStlye = {},
  numColumns,
  ...rest
}: Props) => {
  const { onLayout, width } = useLayout();
  const childs = React.Children.toArray(children);

  numColumns = numColumns || Math.max(1, Math.floor(width / min));
  const maxWidth = width / numColumns;

  const gridProps = {
    onLayout,
    p: outerGap ? gap / 2 : 0,
    opacity: width > 0 ? 1 : 0,
    height: width > 0 ? 'auto' : 0,
  };

  return (
    <Flex wrap relative row {...gridProps} {...rest}>
      {childs.map((child, i) => {
        return (
          <Flex
            key={`${i}`}
            style={{
              paddingRight: (i + 1) % numColumns === 0 ? 0 : gap,
              paddingBottom: i === childs.length - 1 ? 0 : gap,
              flex: 1,
              minWidth: min,
              maxWidth,
            }}
            {...itemStyle}
          >
            {child}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default withThemeProps(Grid, 'Grid');
