import * as React from "react";
import { useContext, forwardRef } from "react";
import scStyled, {
  ThemeProvider,
  ThemeContext,
  withTheme,
} from "styled-components/native";
import * as RN from "react-native";
import parseStyle from "./parseStyle";
import hoistStatics from "hoist-non-react-statics";

export { withTheme, ThemeProvider };

export const useTheme = () => useContext(ThemeContext);

export const useThemeProps = (props, name) => {
  const theme = useTheme();
  return Object.assign({ theme }, theme[name] || {}, props);
};

export const withThemeProps = (Component, name) => {
  const WithTheme = React.forwardRef((props, ref) => {
    const theme = useContext(ThemeContext);
    const themeProps = Object.assign({}, theme[name] || {}, props);

    if (process.env.NODE_ENV !== "production" && !theme) {
      // eslint-disable-next-line no-console
      console.warn(
        `[withTheme] You are not using a ThemeProvider nor passing a theme prop or a theme in defaultProps in component class "${name}"`
      );
    }

    return <Component {...props} theme={theme} {...themeProps} ref={ref} />;
  });

  hoistStatics(WithTheme, Component);

  WithTheme.displayName = `WithTheme(${name})`;

  return WithTheme;
};

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}
// @ts-ignore
export default function styled(component, alias) {
  return (arg) => {
    const StyledComp = scStyled(component)((props) => {
      const { theme } = props;
      let style = arg || {};
      if (isFunction(style)) {
        style = style(props);
      }
      if (typeof style[0] === "string") {
        console.log({ isString: true, split: style[0].split(":") });
      }
      // console.log({ getStyle: getStyle(props) });

      const platforms = ["web", "ios", "android", "native"];
      platforms.map((platform) => {
        if (
          (style[platform] && RN.Platform.OS === platform) ||
          (style[platform] &&
            platform === "native" &&
            ["ios", "android"].indexOf(RN.Platform.OS) > -1)
        ) {
          style = { ...style, ...style[platform] };
        }
      });

      if (alias === "Text" && !style["fontFamily"]) {
        style["fontFamily"] = theme.globals.fontFamily;
      }

      const parsedStyle = parseStyle({
        theme,
        ...style,
        overwriteStyles: false,
      });
      delete parsedStyle["absoluteFill"];
      delete parsedStyle["web"];
      delete parsedStyle["native"];
      delete parsedStyle["android"];
      delete parsedStyle["ios"];
      delete parsedStyle["font"];

      return { ...parsedStyle, ...parseStyle(props) };
    });
    return StyledComp;
  };
}
// export default function styled(component) {
//   //return scStyled(component);
//   return scStyled(props => {
//     console.log({ propssss: props, component });
//     return <Box as={component} {...props} />;
//   });
// }

Object.keys(scStyled).forEach((alias) => {
  Object.defineProperty(styled, alias, {
    enumerable: true,
    configurable: false,
    get() {
      return styled(RN[alias], alias);
    },
  });
});
