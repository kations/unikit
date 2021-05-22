import React from 'react';

const ThemeContext = React.createContext({
  colors: {},
  spacing: {},
  breakpoints: {},
});

export default ThemeContext;
