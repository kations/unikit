import * as React from "react";
import { StyleSheet } from "react-native";
import { withTheme, useTheme } from "./Theme";

import elements from "./styledElements";

const colorStyles = ["color", "backgroundColor", "borderColor"];

const getThemeStyle = (style, theme) => {
  const themeStyle = { ...style };
  colorStyles.map(key => {
    if (style[key]) {
      themeStyle[key] = theme.colors[style[key]] || style[key];
    }
  });
  if (style["fontSize"] && theme.fontSize[style["fontSize"]]) {
    themeStyle["fontSize"] = theme.fontSize[style["fontSize"]];
  }
  return themeStyle;
};

const styled = (Component, Overwrites) => {
  const comp = arg => {
    return withTheme(({ style, children, theme, as, ...rest }) => {
      if (typeof arg === "function") {
        var styles = arg({ theme, ...rest });
      } else {
        var styles = arg;
      }
      let composed = [];
      if (styles) {
        const themeStyle = getThemeStyle(styles, theme);
        composed = [
          ...composed,
          StyleSheet.create({
            themeStyle
          }).themeStyle
        ];
        //console.log({ themeStyle, composed, styles, rest });
      }

      if (Array.isArray(style)) {
        composed = [...composed, ...style];
      } else if (style) {
        const themeStyle = getThemeStyle(style, theme);
        //console.log({ themeStyle, style });
        composed = [
          ...composed,
          StyleSheet.create({
            themeStyle
          }).themeStyle
        ];
      }

      const RenderComp = as ? as : Component;

      RenderComp.displayName = `styled(${getDisplayName(RenderComp)})`;

      return (
        <RenderComp style={composed} {...rest}>
          {children}
        </RenderComp>
      );
    });
  };

  return arg => {
    // if (typeof arg === "function") {
    //   console.log({ arg: arg({ cancelColor: "#000" }) });
    //   return withTheme(comp(arg({ cancelColor: "#000" })));
    // }
    // console.log({ arg });
    return comp(arg);
  };
};

// const interleave = vals => {
//   let strings = vals[0];
//   let finalArray = [strings[0]];
//   for (let i = 1, len = vals.length; i < len; i++) {
//     finalArray.push(vals[i]);
//     if (strings[i] !== undefined) {
//       finalArray.push(strings[i]);
//     }
//   }
//   return finalArray;
// };

// const createCss = StyleSheet => {
//   return function css(...args) {
//     let vals;

//     // these are declared earlier
//     // this is done so we don't create a new
//     // handleInterpolation function on every css call
//     styles = [];
//     buffer = "";
//     lastType = undefined;

//     if (args[0] == null || args[0].raw === undefined) {
//       vals = args;
//     } else {
//       vals = interleave(args);
//     }

//     return StyleSheet.flatten(styles);
//   };
// };

// export function createStyled(StyleSheet: Object) {
//   const css = createCss(StyleSheet);
//   console.log({ css, StyleSheet });
//   return function createEmotion(component: React.ElementType) {
//     console.log({ component });
//     return function createStyledComponent(...rawStyles) {
//       let styles;

//       if (rawStyles[0] == null || rawStyles[0].raw === undefined) {
//         styles = rawStyles;
//       } else {
//         styles = interleave(rawStyles);
//       }

//       console.log({ styles });

//       // do we really want to use the same infra as the web since it only really uses theming?
//       // $FlowFixMe
//       let Styled = React.forwardRef(({ style, ...rest }, ref) => {
//         return React.createElement(component, {
//           ref: ref,
//           style: style || {},
//           ...rest
//         });
//       });

//       Styled.withComponent = (newComponent: React.ElementType) =>
//         createEmotion(newComponent)(...styles);

//       Styled.displayName = `styled(${getDisplayName(component)})`;

//       return Styled;
//     };
//   };
// }

const getDisplayName = primitive =>
  typeof primitive === "string"
    ? primitive
    : primitive.displayName || primitive.name || "Styled";

//const styled = createStyled(StyleSheet);

Object.keys(elements).map(key => {
  styled[key] = styled(elements[key]);
});

export default styled;
