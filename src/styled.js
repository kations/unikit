import React, { useContext, forwardRef } from "react";
import scStyled, { ThemeContext, withTheme } from "styled-components/native";
import * as reactNative from "react-native";
//import Box from "./Box";
import { getStyle } from "./util";

const colorStyles = [
  "color",
  "backgroundColor",
  "borderColor",
  "borderBottomColor",
  "borderTopColor"
];

export { withTheme };

export const useTheme = () => useContext(ThemeContext);

export const useThemeProps = (props, name) => {
  const theme = useTheme();
  return Object.assign({}, theme.globals[name], props);
};

// export const withThemeProps = forwardRef((props, ref) => Comp => () => {
//   const theme = useTheme();
//   const themeProps = Object.assign({}, theme[name], props);
//   return <Comp {...themeProps} ref={ref} />;
// });

export const withThemeProps = (Comp, name) =>
  forwardRef((props, ref) => {
    const theme = useTheme();
    const themeProps = Object.assign({}, theme[name], props);
    console.log({ themeProps });
    return <Comp {...themeProps} ref={ref} />;
  });

// export const withThemeProps = (WrappedComponent, name) => {
//   class WithSubscription extends React.Component {
//     render() {
//       const themeProps = Object.assign({}, this.props.theme[name], this.props);
//       return <WrappedComponent {...themeProps} />;
//     }
//   }
//   WithSubscription.displayName = `withThemeProps(${getDisplayName(
//     WrappedComponent
//   )})`;
//   return withTheme(WithSubscription);
// };

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}
// @ts-ignore
export default function styled(component, alias) {
  return arg => {
    const StyledComp = scStyled(component)(props => {
      const { theme } = props;
      let style = arg || {};
      if (isFunction(style)) {
        style = style(props);
      }
      if (typeof style[0] === "string") {
        console.log({ isString: true, split: style[0].split(":") });
      }
      // console.log({ getStyle: getStyle(props) });
      Object.keys(style).map(key => {
        if (colorStyles.indexOf(key) > -1) {
          //console.log({ found: key });
          style[key] = theme.colors[style[key]] || style[key];
        }

        if (key === reactNative.Platform.OS) {
          style = Object.assign({}, style, style[key]);
        }
      });
      if (alias === "Text" && !style["fontFamily"]) {
        style["fontFamily"] = theme.globals.fontFamily;
      }

      if (style.font && props.theme.fonts[style.font]) {
        style = { ...style, ...theme.fonts[style.font] };
        delete style["font"];
      }

      if (style.absoluteFill) {
        style = {
          ...style,
          ...{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }
        };
        delete style["absoluteFill"];
      }

      delete style["web"];
      delete style["android"];
      delete style["ios"];
      return Object.assign({}, style, getStyle(props));
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

Object.keys(scStyled).forEach(alias => {
  Object.defineProperty(styled, alias, {
    enumerable: true,
    configurable: false,
    get() {
      return styled(reactNative[alias], alias);
    }
  });
});
