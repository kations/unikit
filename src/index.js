import tc from "tinycolor2";
import { Platform } from "react-native";
import { isDark, setObjValue, getObjValue } from "./util";
import styled, { useTheme, withTheme } from "./styled";
import Box from "./Box";

import {
  useDimensions,
  useGesture,
  useDebounce,
  useScaledSize,
  usePrevious,
  useInterval
} from "./hooks";

export * from "./Elements";

const isWeb = Platform.OS === "web";
const Touchable = styled.TouchableOpacity();

export {
  Touchable,
  Box,
  isDark,
  styled,
  useTheme,
  withTheme,
  tc as color,
  tc as tinycolor,
  setObjValue,
  getObjValue,
  useDimensions,
  usePrevious,
  useScaledSize,
  useGesture,
  useDebounce,
  useInterval,
  isWeb
};

export { default as ThemeProvider } from "./ThemeProvider";
export { default as Visible } from "./Visible";

///Primitives
export { default as Flex } from "./Flex";
export { default as Image } from "./Image";
export { default as Text } from "./Text";

//UI
export { default as ActionSheet } from "./ActionSheet";
export { default as Animate } from "./Animate";
export { default as Button } from "./Button";
export { default as ButtonGroup } from "./Group";
export { default as Group } from "./Group";
export { default as Avatar } from "./Avatar";
export { default as Progress } from "./Progress";
export { default as Grid } from "./Grid";
export { default as Icon } from "./Icon";
export { default as Page } from "./Page";
export { default as Tabs } from "./Tabs";
export { default as Swiper } from "./Swiper";
export { default as Chart } from "./Chart";
export { default as Overlay } from "./Overlay";
export { default as Headline } from "./Headline";
export { default as Dropdown } from "./Dropdown";
export { default as Collapsible } from "./Collapsible";
export { default as Picker } from "./Picker";

//Inputs
export { default as Input } from "./Input";
export { default as Form } from "./Form";

//Aktions
export { default as Hoverable } from "./Hoverable";
export { default as Ripple } from "./Ripple";
export { default as Alert } from "./Alert";
