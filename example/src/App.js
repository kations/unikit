import React, { useState, Fragment } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import parsePropTypes from "parse-prop-types";

import {
  UniProvider,
  Button,
  Visible,
  Progress,
  Switch,
  Headline,
  Overlay,
  Avatar,
  Tabs,
  Swiper,
  Block,
  Text,
  Flex,
  Gradient,
  Box,
  Table,
  Image,
  Animate,
  Slider,
  DatePicker,
  useTheme,
  Icon,
  Input,
  TextInput,
  ActionSheet,
  Chart,
  Grid,
  ButtonGroup,
  NoSSR,
  Page
} from "unikit";

const prettier = require("prettier/standalone");
const pluginsJS = [require("prettier/parser-babylon")];

const scope = {
  UniProvider,
  Image,
  Button,
  Visible,
  Progress,
  Switch,
  Headline,
  Overlay,
  Avatar,
  Tabs,
  Swiper,
  Block,
  Text,
  Flex,
  Gradient,
  Box,
  Table,
  Animate,
  Icon
};

const ButtonWithTheme = props => {
  const theme = useTheme();
  console.log({ theme });
  return (
    <Button
      style={props.style}
      onPress={() => theme.alert({ type: "success", message: "fidosn" })}
    >
      Send Alert
    </Button>
  );
};

export default () => {
  const [state, setState] = useState({
    comp: null,
    visible: false,
    visible2: false,
    backdrop: false,
    contentMove: 1,
    tab: "Meine",
    tab2: "Meine",
    value: "yolo",
    sliderValue: 20,
    switch: true,
    date: false,
    arrowType: "x",
    color: "#000",
    number: -2,
    actionSheet: false,
    select: ["1"],
    data: [
      { label: "2010", value: 62 },
      { label: "2011", value: 52 },
      { label: "2012", value: 84 },
      { label: "2013", value: -37 },
      { label: "2014", value: 15 },
      { label: "2015", value: 26 },
      { label: "2016", value: 57 },
      { label: "2017", value: 36 },
      { label: "2018", value: -56 },
      { label: "2019", value: 46 }
    ]
  });

  // setInterval(() => {
  //   const data = Array.from({ length: 10 }, () =>
  //     Math.floor(Math.random() * 40)
  //   );
  //   setState({
  //     ...state,
  //     data
  //   });
  // }, 5000);
  const theme = useTheme();
  console.log({ theme });

  return (
    <UniProvider>
      <Page
        style={{ height: 700 }}
        renderHeader={() => (
          <Box
            width="1005"
            height="100px"
            backgroundColor="primary"
            shadow={1}
          />
        )}
      >
        <Input type="date" label="bla" />
        <NoSSR>
          <Chart
            style={{ marginTop: 100 }}
            data={[
              33530,
              253530,
              2535353,
              633535,
              -153534,
              6435344,
              2343454,
              73453453,
              3345344,
              23454354
            ]}
            xAxis
          />
        </NoSSR>
        <Input
          type="text"
          label="bla"
          labelColor="primary"
          value={undefined}
          placeholder="test"
          textColor="primary"
        />
        <Headline animate>PropTypes</Headline>
        <Headline animate level={2}>
          PropTypes
        </Headline>
        <Headline animate level={3}>
          PropTypes
        </Headline>
        <Grid
          maxRow={2}
          gap={0}
          min={500}
          style={{ marginVertical: 100, height: 600 }}
        >
          <Animate onVisible>
            <Box
              width="100%"
              height="200px"
              backgroundColor="primary"
              backgroundColorLighten={0.3}
              shadow={10}
            />
          </Animate>
          {null}
          <Animate onVisible>
            <Box
              width="100%"
              height="200px"
              backgroundColor="primary"
              backgroundColorLighten={0.3}
              shadow={10}
            />
          </Animate>
        </Grid>
        {/* <Grid
          maxRow={2}
          gap={0}
          min={500}
          style={{ marginVertical: 100, height: 600 }}
        >
          <Animate onVisible>
            <Box
              width="100%"
              height="200px"
              backgroundColor="primary"
              backgroundColorLighten={0.3}
              shadow={10}
            />
          </Animate>
          <Animate onVisible>
            <Box
              width="100%"
              height="200px"
              backgroundColor="primary"
              backgroundColorLighten={0.3}
              shadow={10}
            />
          </Animate>
          <Animate onVisible>
            <Box
              width="100%"
              height="200px"
              backgroundColor="primary"
              backgroundColorLighten={0.3}
              shadow={10}
            />
          </Animate>
        </Grid>
        {/* <Headline animated>Das ist ein test</Headline> */}
        {/* <Flex flexDirection="row">
          <Box
            width="100px"
            height="200px"
            margin={10}
            backgroundColor="primary"
            shadow={1}
          />
          <Box
            width="100px"
            height="200px"
            margin={10}
            backgroundColor="primary"
            backgroundColorLighten={0.15}
            shadow={5}
          />
          <Box
            width="100px"
            height="200px"
            margin={10}
            backgroundColor="primary"
            backgroundColorLighten={0.3}
            shadow={10}
          />
        </Flex>
        <Box
          width="100px"
          height="1200px"
          margin={10}
          backgroundColor="primary"
          backgroundColorLighten={0.3}
          shadow={10}
        /> */}

        {/* <Grid>
          <Animate style={{ display: "inline-block", width: "auto" }} onVisible>
            <Box
              width="100%"
              height="200px"
              backgroundColor="primary"
              backgroundColorLighten={0.3}
              shadow={10}
            />
          </Animate>
          <Animate style={{ display: "inline-block", width: "auto" }} onVisible>
            <Box
              width="100%"
              height="200px"
              backgroundColor="primary"
              backgroundColorLighten={0.3}
              shadow={10}
            />
          </Animate>
          <Animate style={{ display: "inline-block", width: "auto" }} onVisible>
            <Box
              width="100%"
              height="200px"
              backgroundColor="primary"
              backgroundColorLighten={0.3}
              shadow={10}
            />
          </Animate>
        </Grid> */}
        <Button
          as={Box}
          loading
          onPress={() => setState({ ...state, actionSheet: true })}
        >
          Show Sheet
        </Button>
        <Input
          label="MultiSelect"
          value={state.select}
          type="multiselect"
          placeholder="bla"
          onChange={select => {
            setState({ ...state, select });
          }}
          options={[
            { value: "1", label: "Eins" },
            { value: "2", label: "Zwei" },
            { value: "3", label: "Drei" }
          ]}
        />
        <Animate onVisible>
          <Box
            width="100%"
            height="200px"
            backgroundColor="primary"
            backgroundColorLighten={0.3}
            shadow={10}
          />
        </Animate>
        <ButtonGroup>
          <Button onPress={() => setState({ ...state, actionSheet: true })}>
            Show Sheet
          </Button>
          <Button
            loading
            progressProps={{
              size: 40
            }}
            onPress={() => setState({ ...state, actionSheet: true })}
          >
            Show Sheet 2
          </Button>
          <ButtonWithTheme
            onPress={() => theme.alert({ type: "success", message: "yolo" })}
          >
            ALert
          </ButtonWithTheme>
        </ButtonGroup>
        <Animate onVisible>
          <Box
            width="100%"
            height="200px"
            backgroundColor="primary"
            backgroundColorLighten={0.3}
            shadow={10}
          />
        </Animate>
        {/* 
        <ActionSheet
          visible={state.actionSheet}
          onClose={() => {
            setState({ ...state, actionSheet: false });
          }}
          onActionPress={() => setState({ ...state, actionSheet: false })}
          actions={[
            {
              label: "test",
              onPress: () => {
                console.log("test");
              }
            }
          ]}
        />
        <Input type="date" label="bla" />
        <Input
          type="select"
          placeholder="bla"
          options={[{ value: "1", label: "Eins" }]}
        /> */}
        {/* <Overlay
        position="bottom"
        height="auto"
        visible={state.visible2}
        contentMove={state.contentMove}
        contentMoveStyle="padding"
        shadow={10}
        padding="40px"
        containerStyle={{ padding: 50 }}
        onClose={() => setState({ ...state, visible2: false })}
        backdrop
        content={() => (
          <Box width="100%">
            <Button onPress={() => setState({ ...state, visible2: false })}>
              Close Overlay 2
            </Button>
          </Box>
        )}
      >
        <Button onPress={() => setState({ ...state, visible2: true })}>
          Open Overlay 2
        </Button>
      </Overlay> */}
        {/* <Image
        width={200}
        source={{
          uri:
            "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
        }}
      />
      <Avatar char="T" />
      <Button mode="invert">Cooler Button</Button>
      <Button mode="outline">Cooler Button</Button>
      <Button marginTop={20} loading>
        Cooler Button
      </Button>
      <Headline animated>Das ist ein test</Headline>
      <Progress progress={10} circleWidth={20} trackWidth={30} />
      {/* <Progress progress={10} circleWidth={20} trackWidth={30} loading /> 
      <Tabs
        value={state.tab2}
        options={["Meine", "Alle", "Archiv"]}
        onChange={value => setState({ ...state, tab2: value })}
      />
      <Tabs
        value={state.tab}
        options={["Meine", "Alle", "Archiv"]}
        onChange={value => setState({ ...state, tab: value })}
        flex={1}
      >
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.15}
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.3}
        />
      </Tabs>
      */}
        {/* <Swiper dots={false} marginTop={20} marginBottom={20} itemSize={300}>
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.15}
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.3}
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.15}
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.3}
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.15}
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.3}
        />
      </Swiper>
      <Swiper
        dots={false}
        dotsOffset={-10}
        marginTop={50}
        marginBottom={50}
        dots
      >
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.15}
        />
        <Box
          width="100%"
          height="200px"
          padding={10}
          backgroundColor="primary"
          backgroundColorLighten={0.3}
        />
      </Swiper>
      <Overlay
        position="left"
        visible={state.visible}
        contentMove={state.contentMove}
        contentMoveStyle="padding"
        width={300}
        height="100%"
        shadow={10}
        padding="40px"
        onClose={() => setState({ ...state, visible: false })}
        backdrop
        content={() => (
          <Fragment>
            <Button onPress={() => setState({ ...state, visible: false })}>
              Close Overlay
            </Button>
          </Fragment>
        )}
      >
        <Button onPress={() => setState({ ...state, visible: true })}>
          Open Overlay
        </Button>
      </Overlay>
      <Overlay
        position="bottom"
        height="auto"
        visible={state.visible2}
        contentMove={state.contentMove}
        contentMoveStyle="padding"
        shadow={10}
        padding="40px"
        onClose={() => setState({ ...state, visible2: false })}
        backdrop
        content={() => (
          <Box width="100%">
            <Button onPress={() => setState({ ...state, visible2: false })}>
              Close Overlay 2
            </Button>
          </Box>
        )}
      >
        <Button onPress={() => setState({ ...state, visible2: true })}>
          Open Overlay 2
        </Button>
      </Overlay> */}
      </Page>
    </UniProvider>
  );
};

// <Flex
// onLayout={({ nativeEvent }) => {
//   if (window.innerWidth > 1024) {
//     setState({
//       ...state,
//       visible: true,
//       backdrop: false,
//       contentMove: 1
//     });
//   } else {
//     setState({
//       ...state,
//       visible: false,
//       backdrop: true,
//       contentMove: 0.1
//     });
//   }
// }}
// >
// <Overlay
//   position="left"
//   visible={state.visible}
//   contentMove={state.contentMove}
//   contentMoveStyle="padding"
//   width={300}
//   height="100%"
//   shadow={10}
//   padding="40px"
//   onClose={() => setState({ ...state, visible: false })}
//   backdrop={state.backdrop}
//   content={() => (
//     <Fragment>
//       <Text onClick={() => setState({ ...state, comp: null })}>
//         Get started
//       </Text>
//       {components.map(comp => {
//         return (
//           <Text
//             key={comp.name}
//             onClick={() => setState({ ...state, comp })}
//           >
//             {comp.name}
//           </Text>
//         );
//       })}
//     </Fragment>
//   )}
// >
//   <Flex
//     relative
//     width="100%"
//     padding="60px 0"
//     alignItems="center"
//     justifyContent="center"
//   >
//     <Gradient />
//     <Flex
//       width="90%"
//       flex="0"
//       justifyContent="space-between"
//       flexDirection={["column", "row", "row"]}
//     >
//       <Block inline>
//         <Headline width="100%" color="#FFF" animated>
//           {state.comp ? state.comp.name : "unikit"}
//         </Headline>

//         {!state.comp ? (
//           <Text maxWidth="500px" marginTop="20px" color="#FFF">
//             build responsive and accessible mobile-first projects for
//             native and web with an easy to use component library
//           </Text>
//         ) : null}
//       </Block>
//       <Block inline>
//         <Button
//           onPress={() =>
//             setState({ ...state, visible: !state.visible })
//           }
//         >
//           open
//         </Button>
//       </Block>
//     </Flex>
//   </Flex>

//   <Flex width="100%" padding="70px 0" alignItems="center">
//     <Block width="90%">
//       {!state.comp && (
//         <Fragment>
//           <Animate delay={1000}>
//             <Headline width="100%" level={3} fontSize={30}>
//               Get started
//             </Headline>
//           </Animate>
//           <Box
//             padding="20px"
//             backgroundColor="primary"
//             backgroundColorLightness={0.96}
//             borderRadius={8}
//             marginTop={20}
//           >
//             <Text>
//               yarn add unikit styled-components polished react-spring
//               swgs
//             </Text>
//           </Box>
//           <Headline width="100%" level={3} fontSize={30} marginTop={20}>
//             Web usage
//           </Headline>
//           <Box
//             padding="20px"
//             backgroundColor="primary"
//             backgroundColorLightness={0.96}
//             borderRadius={8}
//             marginTop={20}
//           >
//             <Text>yarn add react-native react-art</Text>
//           </Box>
//         </Fragment>
//       )}
//       {state.comp && (
//         <LiveProvider
//           code={prettier.format(state.comp.example, {
//             parser: "babel",
//             plugins: pluginsJS
//           })}
//           scope={scope}
//         >
//           <LiveError />
//           <Flex
//             borderRadius={8}
//             overflow="hidden"
//             flexDirection={["column", "column", "row"]}
//             minHeight="500px"
//           >
//             <Flex
//               padding="30px"
//               backgroundColor="primary"
//               backgroundColorLightness={0.96}
//             >
//               <LivePreview />
//             </Flex>
//             <Flex as={LiveEditor} overflow="auto" />
//           </Flex>
//         </LiveProvider>
//       )}

//       {state.comp && (
//         <Fragment>
//           <Headline width="100%" marginTop={50} level={3} fontSize={30}>
//             PropTypes
//           </Headline>
//           {console.log(parsePropTypes(state.comp.comp))}
//           <Table
//             keys={["Prop", "Type", "Required", "Default"]}
//             marginTop={20}
//             data={Object.keys(parsePropTypes(state.comp.comp)).map(
//               key => ({
//                 Prop: key,
//                 Type: parsePropTypes(state.comp.comp)[key].type.name,
//                 Required: parsePropTypes(state.comp.comp)[key].required
//                   ? "true"
//                   : "false",
//                 Default: parsePropTypes(state.comp.comp)[key]
//                   .defaultValue
//                   ? parsePropTypes(state.comp.comp)[key].defaultValue
//                       .value
//                   : ""
//               })
//             )}
//             even
//           />
//         </Fragment>
//       )}
//       <Animate delay={1000} onVisible stayVisible={false}>
//         <Button margin={10}>Modern React component module</Button>
//       </Animate>
//       <Button mode="primary" light={true} disabled margin={10}>
//         Modern React component module
//       </Button>
//       <Button mode="primary" disabled margin={10} shadow={5}>
//         Modern React component module
//       </Button>
//       <Visible onChange={isVisible => console.log(isVisible)}>
//         {({ isVisible }) => (
//           <div>I am {isVisible ? "visible" : "invisible"}</div>
//         )}
//       </Visible>
//       {/* <Progress /> */}
//       {/* <Avatar
//       source={{
//         uri:
//           "https://images.unsplash.com/photo-1550794119-0e83682d0be2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80"
//       }}
//     />
//     <Avatar
//       size={30}
//       char="U"
//       source={{
//         uri:
//           "https://images.unsplash.com/photo-1550794119-0e83682d0be2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80"
//       }}
//     />
//     <Switch
//       value={state.switch}
//       circleSize={50}
//       onChange={value => setState({ switch: value })}
//     />
//     <Switch
//       value={state.switch}
//       onChange={value => console.log(value)}
//     /> */}
//       {/* <Overlay /> */}
//       {/* <Select value="Option 1" options={["Option 1", "Options 2"]} />
//     <Select
//       value="Option 1"
//       options={["Option 1", "Options 2", "Options 3"]}
//       borderRadius={0}
//     >
//       <Switch
//         value={state.switch}
//         onChange={value => console.log(value)}
//       />
//       <Switch
//         value={state.switch}
//         onChange={value => console.log(value)}
//       />
//       <Switch
//         value={state.switch}
//         onChange={value => console.log(value)}
//       />
//     </Select>
//     <div style={{ width: "100%" }}>
//       <Swiper slideWidth={300} index={1} gap={10}>
//         <Block backgroundColor="primary" height={50}>
//           <Switch
//             value={state.switch}
//             onChange={value => console.log(value)}
//           />
//         </Block>
//         <Block backgroundColor="primary" height={50}>
//           <Switch
//             value={state.switch}
//             onChange={value => console.log(value)}
//           />
//         </Block>
//         <Block backgroundColor="primary" height={50}>
//           <Switch
//             value={state.switch}
//             onChange={value => console.log(value)}
//           />
//         </Block>
//       </Swiper>
//     </div> */}
//     </Block>
//   </Flex>
// </Overlay>
// </Flex>
