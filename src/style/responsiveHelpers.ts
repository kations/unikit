import { Dimensions } from 'react-native';
import { BaseTheme, PropValue, ResponsiveValue } from './types';

export const getKeys = <T>(object: T) => Object.keys(object) as (keyof T)[];

export type StyleTransformFunction<
  Theme extends BaseTheme,
  K extends keyof Theme | undefined,
  TVal
> = (params: {
  value: TVal | undefined | null;
  theme: Theme;
  themeKey?: K;
}) => TVal | undefined | null;

type ValueOf<T> = T[keyof T];

function isThemeKey<Theme extends BaseTheme>(
  theme: Theme,
  K: keyof Theme | undefined
): K is keyof Theme {
  return theme[K as keyof Theme];
}

export const getValueForScreenSize = <Theme extends BaseTheme, TVal>({
  responsiveValue,
  breakpoints,
}: {
  responsiveValue: { [key in keyof Theme['breakpoints']]?: TVal };
  breakpoints: Theme['breakpoints'];
}): TVal | undefined => {
  const sortedBreakpoints = Object.entries(breakpoints).sort((valA, valB) => {
    return valA[1] - valB[1];
  });
  const { width } = Dimensions.get('window');
  return sortedBreakpoints.reduce<TVal | undefined>(
    (acc, [breakpoint, minWidth]) => {
      if (width >= minWidth && responsiveValue[breakpoint] !== undefined)
        return responsiveValue[breakpoint] as TVal;
      return acc;
    },
    undefined
  );
};

export const isResponsiveObjectValue = <Theme extends BaseTheme, TVal>(
  val: ResponsiveValue<TVal, Theme>,
  theme: Theme
): val is { [Key in keyof Theme['breakpoints']]?: TVal } => {
  if (!val) return false;
  if (typeof val !== 'object') return false;
  return getKeys(val).reduce((acc: boolean, key) => {
    return acc && theme.breakpoints[key as string] !== undefined;
  }, true);
};

export const getResponsiveValue = <
  TVal extends PropValue,
  Theme extends BaseTheme,
  K extends keyof Theme | undefined
>(
  propValue: ResponsiveValue<TVal, Theme>,
  {
    theme,
    transform,
    themeKey,
  }: {
    theme: Theme;
    transform?: StyleTransformFunction<Theme, K, TVal>;
    themeKey?: K;
  }
):
  | (K extends keyof Theme ? ValueOf<Theme[K]> : never)
  | TVal
  | null
  | undefined => {
  const val = isResponsiveObjectValue(propValue, theme)
    ? getValueForScreenSize({
        responsiveValue: propValue,
        breakpoints: theme.breakpoints,
      })
    : propValue;
  if (transform) return transform({ value: val, theme, themeKey });
  if (isThemeKey(theme, themeKey) && theme[themeKey][val as string]) {
    return val ? theme[themeKey][val as string] : val;
  }

  return val;
};
