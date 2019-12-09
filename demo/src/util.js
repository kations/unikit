import color from "color";
import { Dimensions, Platform, StatusBar } from "react-native";

export const isDark = colorString => {
  const { r, g, b } = color(colorString)
    .rgb()
    .object();
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 180 ? true : false;
};

export const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const isIphoneX = () => {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      (dimen.height === 896 || dimen.width === 896))
  );
};

export const getProgress = (a, b, v) => {
  return (v - a) / (b - a);
};

export const getValueByProgress = (start, end, t) => {
  return start * (1 - t) + end * t;
};
