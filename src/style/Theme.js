import { createTheming } from "@callstack/react-theme-provider";
import defaultTheme from "./defaultTheme";

const { ThemeProvider, withTheme, useTheme } = createTheming(defaultTheme);

export { ThemeProvider, withTheme, useTheme };
