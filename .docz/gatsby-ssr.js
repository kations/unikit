import React from "react";
import { ThemeProvider } from "../src";

export const wrapRootElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <ThemeProvider
      theme={{
        Input: {
          wrapperProps: {
            mt: 5
          },
          shadow: 30,
          clean: false
        }
      }}
    >
      {element}
    </ThemeProvider>
  );
};
