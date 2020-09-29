import * as React from 'react';
import { View } from 'react-native';

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

  numColumns = numColumns || Math.max(1, Math.floor(width / min));

  const gridProps = {
    onLayout,
    p: outerGap ? gap / 2 : 0,
    opacity: width > 0 ? 1 : 0,
    height: width > 0 ? 'auto' : 0,
  };

  const rows = React.useMemo(
    () => chunkArray(React.Children.toArray(children), numColumns),
    [children, numColumns]
  );

  return (
    <Flex wrap relative {...gridProps} {...rest}>
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
          <Flex relative row key={`${index}`} {...rowStlye}>
            {row.map((child, i) => {
              return (
                <Flex
                  key={`${i}`}
                  style={{
                    paddingRight: (i + 1) % numColumns === 0 ? 0 : gap,
                    paddingBottom: index === rows.length - 1 ? 0 : gap,
                    flex: 1,
                  }}
                  {...itemStyle}
                >
                  {child}
                </Flex>
              );
            })}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default withThemeProps(Grid, 'Grid');
