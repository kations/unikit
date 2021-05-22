import tc from 'tinycolor2';
import { PixelRatio } from 'react-native';
import { isWeb, isNative } from '../util';
import { getResponsiveValue } from './responsiveHelpers';

export const transformColor = ({ value, theme, themeKey }) => {
  if (!value) return '#FFF';
  if (theme[themeKey][value]) {
    return theme[themeKey][value];
  }
  let split = value.split(':');

  if (split.length > 1) {
    let themeValue = theme[themeKey][split[0]] || split[0];
    if (!tc(themeValue).isValid()) return themeValue;
    split.map((key, i) => {
      if (i > 0) {
        const next = split[i + 1];
        if (next) {
          try {
            themeValue = tc(themeValue)[key](next).toString();
          } catch (error) {
            //console.log({ error });
          }
        }
      }
    });
    return themeValue;
  }
  return value;
};

function interpolateShadow(i, a, b, a2, b2) {
  return ((i - a) * (b2 - a2)) / (b - a) + a2;
}

const platformSpecific = {
  webStyle: {
    property: false,
    transform: ({ value }) => {
      return isWeb ? value : undefined;
    },
  },
};

const color = {
  color: {
    property: 'color',
    themeKey: 'colors',
    transform: transformColor,
  },
};

const background = {
  bg: {
    property: 'backgroundColor',
    themeKey: 'colors',
    transform: transformColor,
  },
  backgroundColor: {
    property: 'backgroundColor',
    themeKey: 'colors',
    transform: transformColor,
  },
};

const spacingProperties = {
  margin: true,
  marginTop: true,
  marginRight: true,
  marginBottom: true,
  marginLeft: true,
  marginHorizontal: true,
  marginVertical: true,
  marginStart: true,
  marginEnd: true,
  padding: true,
  paddingTop: true,
  paddingRight: true,
  paddingBottom: true,
  paddingLeft: true,
  paddingHorizontal: true,
  paddingVertical: true,
  paddingStart: true,
  paddingEnd: true,
};

const spacingPropertiesShorthand = {
  t: 'top',
  r: 'right',
  l: 'left',
  b: 'bottom',
  w: 'width',
  h: 'height',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  ms: 'marginStart',
  me: 'marginEnd',
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  ps: 'paddingStart',
  pe: 'paddingEnd',
};

const spacing = Object.keys(spacingProperties).map((key) => ({
  property: key,
}));

Object.keys(spacingPropertiesShorthand).map((key) => {
  spacing[key] = {
    property: spacingPropertiesShorthand[key],
  };
});

const layoutProperties = {
  width: true,
  height: true,
  minWidth: true,
  maxWidth: true,
  minHeight: true,
  maxHeight: true,
  overflow: true,
  aspectRatio: true,
  alignContent: true,
  alignItems: true,
  alignSelf: true,
  justifyContent: true,
  flex: true,
  flexBasis: true,
  flexDirection: true,
  flexGrow: true,
  flexShrink: true,
  flexWrap: true,
  zIndex: true,
  opacity: true,
};

const layout = {
  row: {
    property: 'flexDirection',
    transform: ({ value }) => (value === true ? 'row' : undefined),
  },
  wrap: {
    property: 'flexWrap',
    transform: ({ value }) => (value === true ? 'wrap' : undefined),
  },
  flexCenter: {
    property: false,
    transform: ({ value }) => {
      return value === true
        ? { alignItems: 'center', justifyContent: 'center' }
        : undefined;
    },
  },
};
Object.keys(layoutProperties).map((key) => {
  layout[key] = {
    property: key,
  };
});

const positionProperties = {
  position: true,
  top: true,
  right: true,
  bottom: true,
  left: true,
  start: true,
  end: true,
};

const position = {
  absoluteFill: {
    property: false,
    transform: ({ value }) => {
      return value === true
        ? { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }
        : undefined;
    },
  },
  absolute: {
    property: 'position',
    transform: ({ value }) => (value ? 'absolute' : undefined),
  },
  relative: {
    property: 'position',
    transform: ({ value }) => (value ? 'relative' : undefined),
  },
  fixed: {
    property: 'position',
    transform: ({ value }) =>
      value ? (isWeb ? 'fixed' : 'absolute') : undefined,
  },
};
Object.keys(positionProperties).map((key) => {
  position[key] = {
    property: key,
  };
});

const borderProperties = {
  borderBottomWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderStyle: true,
  borderTopWidth: true,
  borderStartWidth: true,
  borderEndWidth: true,
  borderWidth: true,
};

const border = {};
Object.keys(borderProperties).map((key) => {
  border[key] = {
    property: key,
  };
});

const borderRadiusProperties = {
  borderRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderBottomStartRadius: true,
  borderBottomEndRadius: true,
  borderTopStartRadius: true,
  borderTopEndRadius: true,
};

const borderRadius = {};
Object.keys(borderRadiusProperties).map((key) => {
  borderRadius[key] = {
    property: key,
  };
});

const borderColorProperties = {
  borderColor: true,
  borderTopColor: true,
  borderRightColor: true,
  borderLeftColor: true,
  borderBottomColor: true,
  borderStartColor: true,
  borderEndColor: true,
};

const borderColor = {};
Object.keys(borderColorProperties).map((key) => {
  borderColor[key] = {
    property: key,
    themeKey: 'colors',
    transform: transformColor,
  };
});

const shadowProperties = {
  shadowOpacity: true,
  shadowOffset: true,
  shadowRadius: true,
  elevation: true,
  textShadowOffset: true,
  textShadowRadius: true,
};

const shadow = {
  shadow: {
    property: false,
    transform: ({ value, theme }) => {
      if (!value) return {};
      const b = Math.floor(value * 1.33);
      const h = value === 1 ? 1 : Math.floor(value * 0.25);
      const r = interpolateShadow(b, 1, 38, 1, 16);
      const o = interpolateShadow(value, 1, 24, 0.2, 0.6);

      return {
        shadowColor: theme.colors.shadow,
        shadowOffset: {
          width: 0,
          height: h || 1,
        },
        shadowRadius: r,
        shadowOpacity: o,
        elevation: value - 1,
      };
    },
  },
};
Object.keys(shadowProperties).map((key) => {
  shadow[key] = {
    property: key,
  };
});

const textShadowProperties = {
  textShadowOffset: true,
  textShadowRadius: true,
};
const textShadow = {
  textShadowColor: {
    property: 'textShadowColor',
    themeKey: 'colors',
    transform: transformColor,
  },
};
Object.keys(textShadowProperties).map((key) => {
  textShadow[key] = {
    property: key,
  };
});

const typographyProperties = {
  fontFamily: true,
  fontSize: true,
  fontStyle: true,
  fontWeight: true,
  letterSpacing: true,
  lineHeight: true,
  textAlign: true,
  textDecorationLine: true,
  textDecorationStyle: true,
  textTransform: true,
};

const typographyPropertiesShorthand = {
  bold: 'fontWeight',
  uppercase: 'textTransform',
  lowercase: 'textTransform',
  capitalize: 'textTransform',
  italic: 'fontStyle',
  underline: 'textDecorationLine',
};

const typography = {
  font: {
    property: false,
    transform: ({ value, theme }) => {
      return theme.fonts[value] || {};
    },
  },
  dynamicFontSize: {
    property: false,
    transform: ({ value = { min: 0, max: 100, factor: 8 }, theme }) => {
      const scale = PixelRatio.getFontScale();
      return {
        fontSize: Math.min(
          (theme.width * scale) / (value.factor || 8),
          value.max || 100
        ),
      };
    },
  },
};

Object.keys(typographyProperties).map((key) => {
  typography[key] = {
    property: key,
  };
});

Object.keys(typographyPropertiesShorthand).map((key) => {
  typography[key] = {
    property: typographyPropertiesShorthand[key],
    transform: ({ value }) => (value === true ? key : undefined),
  };
});

const boxFunctions = {
  ...background,
  ...spacing,
  ...layout,
  ...position,
  ...border,
  ...borderRadius,
  ...borderColor,
  ...shadow,
  ...platformSpecific,
  ...color,
  ...textShadow,
  ...typography,
};

const textFunctions = {
  ...spacing,
  ...layout,
  ...position,
  ...platformSpecific,
  ...color,
  ...textShadow,
  ...typography,
};

const matchProps = (props, functions, theme) => {
  const styles = {};
  const merged = props;

  Object.keys(merged).map((key) => {
    const style = functions[key];
    if (style && typeof merged[key] !== 'undefined') {
      const { transform, themeKey, property } = style;
      const value = getResponsiveValue(merged[key], {
        theme,
        themeKey,
        transform,
      });
      if (property) {
        if (
          isNative &&
          typeof value === 'string' &&
          value.length > 0 &&
          (value.indexOf('vh') > -1 || value.indexOf('vw') > -1)
        ) {
          if (value.indexOf('vh') > -1) {
            styles[property] =
              (parseInt(value.replace('vh', ''), 10) / 100) * theme.height;
          } else {
            styles[property] =
              (parseInt(value.replace('vw', ''), 10) / 100) * theme.width;
          }
        } else {
          styles[property] = value;
        }
      } else if (property === false && typeof value === 'object') {
        Object.keys(value).map((valueKey) => {
          styles[valueKey] = value[valueKey];
        });
      }
    }
  });
  return styles;
};

export { boxFunctions, textFunctions, matchProps };
