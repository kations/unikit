import React from "react";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "../src";

const GlobalStyle = createGlobalStyle`
 * {
   outline: none!important;
 }
`;

export const wrapRootElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <ThemeProvider
      theme={{
        globals: {
          Input: {
            mt: 10
          }
        }
      }}
    >
      <GlobalStyle />
      {element}
    </ThemeProvider>
  );
};
