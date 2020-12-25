export * from './types';
export * from './styled';
export * from './styledText';
export * from './styledFunctions';

export { default as styled } from './styled';
export { default as styledText } from './styledText';
export { ThemeProvider, showAlert, hideAlert } from './context';
export { default as useTheme } from './hooks/useTheme';
export { default as useResponsiveProp } from './hooks/useResponsiveProp';
export { default as withThemeProps } from './hooks/withThemeProps';
export { default as withTheme } from './hooks/withTheme';
