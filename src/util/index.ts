import { PixelRatio, Platform } from 'react-native';
import tc from 'tinycolor2';
import type { BaseTheme } from '../style/types';

export { default as deepMerge } from './deepMerge';
export { default as generateHash } from './generateHash';
export { default as getValue } from './getValue';
export { default as setValue } from './setValue';

export function isFunction(functionToCheck: () => void) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

export function randomId() {
  return Math.random().toString(36).substr(2, 9);
}

export function isNumber(value: number) {
  if (value === 0) return true;
  return isFinite(value);
}

export function rem(value: number): number | string {
  if (Platform.OS === 'web') return `${value}rem`;
  return PixelRatio.getFontScale() * 16 * value;
}

export function em(value: number): number | string {
  if (Platform.OS === 'web') return `${value}em`;
  return rem(value);
}

export const getProgress = (a: number, b: number, v: number) => {
  const p = (v - a) / (b - a);
  return parseFloat(p.toFixed(3));
};

export const getValueByProgress = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

export const colorAware = (value: string, theme: BaseTheme) => {
  const themeC = theme.colors[value] || value;
  const brightness = tc(themeC).getBrightness();
  const c = brightness > 170 ? '#000' : '#FFF';
  return c;
};

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isNative = Platform.OS === 'android' || Platform.OS === 'ios';
