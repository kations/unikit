import * as React from 'react';
import useTheme from './useTheme';

const withThemeProps = (Component: React.ComponentType, name: string) => {
  const ForwardRefComponent = React.forwardRef((props: any, ref) => {
    const theme = useTheme();
    const themeProps = Object.assign({}, { theme }, theme[name] || {}, props);
    return <Component ref={ref} {...themeProps} />;
  });

  return ForwardRefComponent;
};

export default withThemeProps;
