//import "resize-observer-polyfill/dist/ResizeObserver.global";
import color from "color";
import { isDark, setObjValue, getObjValue } from "./util";
import styled, { useTheme, withTheme } from "./styled";
import { useWindowDimensions, useGesture, useDebounce } from "./hooks";

export {
  isDark,
  styled,
  useTheme,
  withTheme,
  color,
  setObjValue,
  getObjValue,
  useWindowDimensions,
  useGesture,
  useDebounce
};

export { default as ThemeProvider } from "./ThemeProvider";

///Primitives
export { default as Flex } from "./Flex";
export { default as Box } from "./Box";
export { default as Image } from "./Image";
export { default as Text } from "./Text";

//UI
export { default as ActionSheet } from "./ActionSheet";
export { default as Animate } from "./Animate";
export { default as Button } from "./Button";
export { default as ButtonGroup } from "./ButtonGroup";
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

//Inputs
export { default as Input } from "./Input";
export { default as Form } from "./Form";

//Aktions
export { default as Hoverable } from "./Hoverable";
export { default as Ripple } from "./Ripple";
export { default as Alert } from "./Alert";
