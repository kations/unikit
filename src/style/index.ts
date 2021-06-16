import styled from './styled';
export { default as ThemeProvider } from './ThemeProvider';
export { default as useTheme } from './useTheme';
export { default as withThemeProps } from './withThemeProps';
export * from './types';
export * from './styledFunctions';

const Touchable = styled.Touchable();
const Pressable = styled.Pressable();

export { styled, Touchable, Pressable };
