import React, { useContext } from "react";
import scStyled, { ThemeContext, withTheme } from "styled-components/native";
import * as reactNative from "react-native";

const colorStyles = [
  "color",
  "backgroundColor",
  "borderColor",
  "borderBottomColor",
  "borderTopColor"
];

export const useTheme = () => useContext(ThemeContext);

export const useThemeProps = (props, name) => {
  const theme = useTheme();
  return Object.assign({}, theme.globals[name], props);
};

export const withThemeProps = (WrappedComponent, name) => {
  class WithSubscription extends React.Component {
    render() {
      const themeProps = Object.assign(
        {},
        this.props.theme.globals[name],
        this.props
      );
      return <WrappedComponent {...themeProps} />;
    }
  }
  WithSubscription.displayName = `withThemeProps(${getDisplayName(
    WrappedComponent
  )})`;
  return withTheme(WithSubscription);
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}
// @ts-ignore
export default function styled(component) {
  return arg => {
    return scStyled(component)(props => {
      let style = arg;
      if (isFunction(style)) {
        style = style(props);
      }
      if (typeof style[0] === "string") {
        console.log({ isString: true, split: style[0].split(":") });
      }
      Object.keys(style).map(key => {
        if (colorStyles.indexOf(key) > -1) {
          //console.log({ found: key });
          style[key] = props.theme.colors[style[key]] || style[key];
        }
        if (key === "fontSize") {
          style[key] = props.theme.fontSize[style[key]] || style[key];
        }
        if (key === reactNative.Platform.OS) {
          style = Object.assign({}, style, style[key]);
        }
      });
      delete style["web"];
      delete style["android"];
      delete style["ios"];
      return style;
    });
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
      return styled(reactNative[alias]);
    }
  });
});
