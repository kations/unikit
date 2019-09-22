import React, { Fragment, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
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
  Flex,
  Form,
  Overlay,
  ActionSheet
} from "./src";

const Bla = styled(Box)({});

const Hook = () => {
  const theme = useTheme();
  return (
    <Fragment>
      {/* <Headline animate>Headline Test</Headline> */}

      <Flex p={30} w="100%" type="background">
        <Form
          onSubmit={doc => alert(JSON.stringify(doc))}
          buttonProps={{ mt: 10 }}
        >
          <Input key="texttwo" type="text" label="Text" required />
          <Flex p={30} type="background">
            <Input key="text" type="text" label="Text" required />
          </Flex>
          <Input key="range" type="range" label="Slider" />
          <Input key="tags" type="tags" label="Tags" value={["Tag"]} />
          <Input key="switch" type="switch" label="Switch" />
          <Input
            key="select"
            type="select"
            label="Select"
            options={["One", "Two"]}
          />
          <Input key="number" type="number" label="Number" />
          <Input key="checkbox" type="checkbox" label="Checkbox" />
          <Input key="date" type="date" label="DatePicker" />
        </Form>
      </Flex>
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
  const [overlay, setOverlay] = useState(false);
  return (
    <ThemeProvider
      theme={{ globals: { Input: { mt: 10 }, Overlay: { roundness: 7 } } }}
      alertProps={{ from: "bottom" }}
    >
      <ScrollView style={styles.container}>
        {/* <Progress value={30} size={100} trackWidth={5} circleWidth={5} /> */}
        <Hook />
        <Text level={1}>Open up App.js to start working on your app!</Text>
        <Button outlined ripple onPress={() => setOverlay(true)}>
          Show Overlay
        </Button>
        <ActionSheet
          p={30}
          width={800}
          visible={overlay}
          onClose={() => setOverlay(false)}
          actions={[
            {
              label: "test"
            },
            {
              label: "test"
            },
            {
              label: "test"
            }
          ]}
        >
          <Button onPress={() => setOverlay(false)}>close overlay</Button>
        </ActionSheet>
      </ScrollView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
