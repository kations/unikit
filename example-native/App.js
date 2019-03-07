import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeProvider } from "styled-components";

import Switch from "./components/Switch";

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider
        theme={{
          unikit: {
            colors: {
              primary: "#FF6B87",
              text: "#FF6B87"
            },
            globals: {
              borderRadius: 10,
              lightness: 0.95
            }
          }
        }}
      >
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <Switch />
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
