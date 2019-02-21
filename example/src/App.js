import React, { Component } from "react";
import { ThemeProvider } from "styled-components/native";

import { Button, Visible, Progress } from "unikit";

export default class App extends Component {
  render() {
    console.log(Button.propTypes);
    return (
      <ThemeProvider
        theme={{
          unikit: {
            colors: {
              primary: "#FF6B87"
            },
            globals: {
              borderRadius: 10,
              lightness: 0.95
            }
          }
        }}
      >
        <div>
          <Button mode="primary" light style={{ margin: 10 }}>
            Modern React component module
          </Button>
          <Button mode="primary" style={{ margin: 10 }}>
            Modern React component module
          </Button>
          <Button mode="primary" light disabled style={{ margin: 10 }}>
            Modern React component module
          </Button>
          <Button mode="primary" disabled style={{ margin: 10 }}>
            Modern React component module
          </Button>
          <Visible onChange={isVisible => console.log(isVisible)}>
            {({ isVisible }) => (
              <div>I am {isVisible ? "visible" : "invisible"}</div>
            )}
          </Visible>
          <Progress />
        </div>
      </ThemeProvider>
    );
  }
}
