import { PixelRatio, Platform } from 'react-native';

export { default as deepMerge } from './deepMerge';
export { default as generateHash } from './generateHash';

export function isFunction(functionToCheck: () => {}) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

export function isNumber(value: number) {
  if (value === 0) return true;
  return isFinite(value);
}

export function rem(value: number) {
  //if (Platform.OS === 'web') return `${value}em`;
  return PixelRatio.getFontScale() * 16 * value;
}

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isNative = Platform.OS === 'android' || Platform.OS === 'ios';
