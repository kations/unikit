//import * as React from 'react';
// import { Text } from 'react-native';

// interface Props {
//   name: string;
//   [key: string]: any;
// }

// export default ({ name = '', ...rest }: Props) => {
//   const [test, setTest] = React.useState<string | null>('bla');
//   return <Text {...rest}>{test || ''}</Text>;
// };
import color from "tinycolor2";
import { AnimatedView, useSpring, Animated } from "./spring";

export * from "./hooks";
export * from "./restyle";
export * from "./components";
export * from "./utils";
export { AnimatedView, useSpring, Animated, color };
