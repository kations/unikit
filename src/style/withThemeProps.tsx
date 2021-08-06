import * as React from "react";
import useTheme from "./useTheme";

const getModeProps = (modes: object, props: object) => {
  let p = {};
  Object.keys(modes).forEach((key) => {
    if (props[key] === true) {
      p = { ...p, ...modes[key](props) };
    }
  });
  return p;
};

const withThemeProps = (
  Component: React.ComponentType,
  name: string,
  modes: object
) => {
  const ForwardRefComponent = React.forwardRef((props: any, ref) => {
    const theme = useTheme();
    const modeProps = modes ? getModeProps(modes, props) : {};
    const themeProps = Object.assign(
      {},
      { theme },
      theme[name] || {},
      props,
      modeProps
    );
    return <Component ref={ref} {...themeProps} />;
  });

  return ForwardRefComponent;
};

export default withThemeProps;
