// import React from 'react';

// import { withThemeProps } from '../../style';
// import Flex from '../Flex';

// interface Props {
//   children: React.ReactNode;
//   min: number;
//   theme: object;
//   gap: number;
//   outerGap: boolean;
//   itemStyle: object;
//   rowStlye: object;
//   numColumns?: number;
//   [key: string]: any;
// }

// const Grid = ({
//   children,
//   min = 250,
//   max,
//   gap = 5,
//   outerGap = false,
//   itemStyle = {},
//   ...rest
// }: Props) => {
//   const gridProps = { gap, min, max, p: outerGap ? gap : 0 };

//   return (
//     <Flex
//       {...gridProps}
//       style={{
//         width: '100%',
//         position: 'relative',
//         display: 'grid',
//         gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), ${
//           max || '1fr'
//         }))`,
//         gridColumnGap: gap,
//         gridRowGap: gap,
//         ...(gridProps.style || {}),
//       }}
//       {...rest}
//     >
//       {React.Children.toArray(children).map((child, i) => {
//         if (child) {
//           return (
//             <Flex
//               key={i}
//               style={{ width: `100%`, maxWidth: '100%', ...itemStyle }}
//             >
//               {child}
//             </Flex>
//           );
//         }
//       })}
//     </Flex>
//   );
// };

// export default withThemeProps(Grid, 'Grid');
// import * as React from "react";

// import { withThemeProps } from "../../style";
// import { useLayout } from "../../hooks";
// import Flex from "../Flex";

// interface Props {
//   children: React.ReactNode;
//   min: number;
//   theme: object;
//   gap: number;
//   outerGap: boolean;
//   itemStyle: object;
//   rowStlye: object;
//   numColumns?: number;
//   [key: string]: any;
// }

// const Grid = ({
//   children,
//   min = 250,
//   gap = 5,
//   outerGap = false,
//   itemStyle = {},
//   rowStlye = {},
//   numColumns,
//   ...rest
// }: Props) => {
//   const { onLayout, width } = useLayout();
//   const childs = React.Children.toArray(children);

//   console.log({ width });

//   numColumns = numColumns || Math.max(1, Math.floor(width / min));
//   const maxWidth = width / numColumns;

//   const gridProps = {
//     p: outerGap ? gap / 2 : 0,
//     opacity: width > 0 ? 1 : 0,
//     height: width > 0 ? "auto" : 0,
//   };

//   return (
//     <Flex
//       key={`${width}`}
//       wrap
//       w="100%"
//       relative
//       row
//       {...gridProps}
//       {...rest}
//       onLayout={onLayout}
//     >
//       {childs.map((child, i) => {
//         return (
//           <Flex
//             key={`${i}`}
//             style={{
//               paddingRight: (i + 1) % numColumns === 0 ? 0 : gap,
//               paddingBottom: i === childs.length - 1 ? 0 : gap,
//               flex: 1,
//               minWidth: min,
//               maxWidth,
//             }}
//             {...itemStyle}
//           >
//             {child}
//           </Flex>
//         );
//       })}
//     </Flex>
//   );
// };

// export default withThemeProps(Grid, "Grid");

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
      webStyle={{ whiteSpace: 'nowrap' }}
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
