import React, { forwardRef } from "react";
import tc from "tinycolor2";
import { Platform, View } from "react-native";
import styled, { useTheme, withTheme } from "./styled";
import Box from "./Box";
import { showAlert, hideAlert } from "./ThemeProvider";

export const isWeb = Platform.OS === "web";
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isNative = Platform.OS === "android" || Platform.OS === "ios";

const Touchable = styled.TouchableOpacity();

export * from "./hooks";
export * from "./Spring";
export * from "./util";
export * from "./Elements";
export * from "./refs";

export {
  Touchable,
  Box,
  styled,
  useTheme,
  withTheme,
  tc as color,
  tc as tinycolor,
  showAlert,
  hideAlert,
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
export { default as LineChart } from "./LineChart";
export { default as Overlay } from "./Overlay";
export { default as Headline } from "./Headline";
export { default as Dropdown } from "./Dropdown";
export { default as Collapsible } from "./Collapsible";
export { default as Picker } from "./Picker";
export { default as Calendar } from "./Calendar";
export { default as LinearProgress } from "./LinearProgress";
//Inputs
export { default as Input } from "./Input";
export { default as Form } from "./Form";

//Aktions
export { default as Hoverable } from "./Hoverable";
export { default as Ripple } from "./Ripple";
export { default as Alert } from "./Alert";
