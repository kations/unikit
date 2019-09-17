import React from "react";
import { ThemeProvider } from "../src";

export const wrapRootElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <ThemeProvider
      theme={{
        globals: {
          Input: {
            mt: 5
          }
        }
      }}
    >
      {element}
    </ThemeProvider>
  );
};
