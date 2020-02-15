import React from "react";
import { ThemeProvider } from "../src";

export const wrapRootElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (
    <ThemeProvider
      theme={{
        colors: {
          modes: {
            dark: {
              text: "#FFF",
              primary: "#CCC"
            }
          }
        },
        Button: {
          mt: 10
        },
        Input: {
          wrapperProps: {
            mt: 5
          },
          shadow: 0,
          clean: false
        }
      }}
    >
      {element}
    </ThemeProvider>
  );
};
