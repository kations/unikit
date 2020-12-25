import * as React from 'react';
import useTheme from './useTheme';

const withTheme = (BaseComponent) =>
  React.forwardRef((props, ref) => {
    const theme = useTheme();
    return <BaseComponent ref={ref} theme={theme} {...props} />;
  });

export default withTheme;
