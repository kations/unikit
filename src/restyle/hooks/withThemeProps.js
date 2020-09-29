import * as React from 'react';
import useTheme from './useTheme';

const withThemeProps = (BaseComponent, name) =>
  React.forwardRef((props: any, ref) => {
    const theme = useTheme();
    const themeProps = Object.assign({}, { theme }, theme[name] || {}, props);

    return <BaseComponent ref={ref} {...themeProps} />;
  });

export default withThemeProps;
