import { ScrollView, View } from 'react-native';
import React, { ReactElement, useState } from 'react';
import Animated from 'react-native-reanimated';

import { withThemeProps } from '../../style';

const AnimatedList = Animated.createAnimatedComponent(ScrollView);

interface Props {
  children: React.ReactNode;
  min: number;
  theme: object;
  gap: number;
  itemStyle: object;
  rowStlye: object;
  numColumns?: number;
  [key: string]: any;
}

function Grid({
  children,
  keyPrefix = 'grid',
  numColumns = 2,
  gap = 10,
  outerGap = true,
  style,
  ...rest
}: Props) {
  const data = React.Children.toArray(children);

  return (
    <View
      style={{ flex: 1, flexDirection: 'row', padding: outerGap ? gap / 2 : 0 }}
    >
      {Array.from(Array(numColumns), (_, num) => {
        return (
          <View
            key={`${keyPrefix}-${num.toString()}`}
            style={{ flex: 1 / numColumns, padding: gap / 2 }}
          >
            {data
              .map((el, i) => {
                if (i % numColumns === num) return el;

                return null;
              })
              .filter((e) => !!e)}
          </View>
        );
      })}
    </View>
  );
}

export default withThemeProps(Grid, 'Grid');
