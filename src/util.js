import tc from "tinycolor2";
import { Dimensions, Platform, PixelRatio } from "react-native";

const get = require("get-value");
const set = require("set-value");

export function isNumber(value) {
  if (value === 0) return true;
  return isFinite(value);
}

export function rem(value) {
  return PixelRatio.getFontScale() * 16 * value;
}

export function em(value) {
  if (Platform.OS === "web") return `${value}em`;
  return rem(value);
}

export const setObjValue = (obj, path, value) => {
  return set(obj, path, value);
};

export const getObjValue = (obj, path) => {
  return get(obj, path);
};

export const isDark = (colorString) => {
  return tc(colorString).isValid() && tc(colorString).getBrightness() < 195;
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
      dimen.height === 896 ||
      dimen.width === 896)
  );
};

export const getProgress = (a, b, v) => {
  return (v - a) / (b - a);
};

export const getValueByProgress = (start, end, t) => {
  return start * (1 - t) + end * t;
};
