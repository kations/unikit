import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import {
  ThemeProvider,
  Button,
  Text,
  styled,
  useTheme,
  Input,
  Box,
  Animate,
  Progress,
  Headline
} from "./src";

const Bla = styled(Box)({});

const Hook = () => {
  const theme = useTheme();
  return (
    <Fragment>
      <Headline animate>Headline Test</Headline>
      <Input label="Test" />
      <Animate>
        <Bla w={100} h={100} type="success" />
      </Animate>
      <Input.Slider
        value={30}
        steps={10}
        mt={50}
        onChange={value => console.log(value)}
      />
      <Button
        type="primary"
        loading
        onPress={() => theme.alert({ type: "success", message: "yo" })}
      >
        Test
      </Button>
    </Fragment>
  );
};

export default function App() {
  return (
    <ThemeProvider alertProps={{ from: "bottom" }}>
      <View style={styles.container}>
        <Progress value={30} size={100} trackWidth={5} circleWidth={5} />
        <Hook />
        <Text level={1}>Open up App.js to start working on your app!</Text>
        <Button outlined ripple>
          Test
        </Button>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
