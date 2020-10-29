import { PixelRatio, Platform } from 'react-native';
import tc from 'tinycolor2';

const get = require('get-value');
const set = require('set-value');

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isNative = Platform.OS === 'android' || Platform.OS === 'ios';

export const setObjValue = (obj, path, value) => {
  return set(obj, path, value);
};

export const getObjValue = (obj, path) => {
  return get(obj, path);
};

export const isDark = (colorString) => {
  return tc(colorString).isValid() && tc(colorString).getBrightness() < 195;
};

export function rem(value: number) {
  //if (Platform.OS === 'web') return `${value}em`;
  return PixelRatio.getFontScale() * 16 * value;
}

export function em(value) {
  //if (Platform.OS === 'web') return `${value}em`;
  return rem(value);
}

export const getProgress = (a, b, v) => {
  return (v - a) / (b - a);
};

export const getValueByProgress = (start, end, t) => {
  return start * (1 - t) + end * t;
};

export function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

export function isNumber(value) {
  if (value === 0) return true;
  return isFinite(value);
}

///Emotion
export const testAlwaysTrue = () => true;

export const pickAssign: (
  testFn: (key: string) => boolean,
  target: {},
  ...sources: Array<{}>
) => Object = function (testFn, target) {
  let i = 2;
  let length = arguments.length;
  for (; i < length; i++) {
    let source = arguments[i];
    let key;
    for (key in source) {
      if (testFn(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

// export function interleave(vals: []) {
//   let strings = vals[0];
//   let finalArray = [strings[0]];
//   for (let i = 1, len = vals.length; i < len; i++) {
//     finalArray.push(vals[i]);
//     if (strings[i] !== undefined) {
//       finalArray.push(strings[i]);
//     }
//   }
//   return finalArray;
// }
