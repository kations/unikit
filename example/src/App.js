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
  TextInput
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

const components = [
  {
    name: "Box",
    comp: Box,
    group: "Primitives",
    example: `
    <React.Fragment>
        <Box  height={100} backgroundColor="primary" />
        <Box  height={100} backgroundColor="primary" backgroundColorLightness={0.8} />
        <Box  height={100} backgroundColor="primary" backgroundColorLightness={0.5} />
      </React.Fragment>
    `
  },
  {
    name: "Block",
    comp: Block,
    group: "Primitives",
    example: `
    <React.Fragment>
        <Block inline width={100} height={100} backgroundColor="primary" />
        <Block inline width={100} height={100} backgroundColor="primary" backgroundColorLightness={0.8} />
        <Block inline width={100} height={100} backgroundColor="primary" backgroundColorLightness={0.5} />
      </React.Fragment>
    `
  },
  {
    name: "Flex",
    comp: Flex,
    group: "Primitives",
    example: `
    <React.Fragment>
      <Flex flexDirection="row" justifyContent="space-between" flexWrap="wrap">
        <Box width={100} height={100} backgroundColor="primary" />
        <Box width={100} height={100} backgroundColor="primary" backgroundColorLightness={0.8} />
        <Box width={100} height={100} backgroundColor="primary" backgroundColorLightness={0.5} />
      </Flex>
      </React.Fragment>
    `
  },
  {
    name: "Image",
    comp: Image,
    group: "Primitives",
    example: `
    <React.Fragment>
      <Image full source={{
        uri:
          "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
      }} />

      <Image marginTop="20px" width={200} height={200} resizeMode="cover" source={{
        uri:
          "https://images.unsplash.com/photo-1551446591-142875a901a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
      }} />

      <Image marginTop="20px" width={200} height={200} blurRadius={10} resizeMode="cover" source={{
        uri:
          "https://images.unsplash.com/photo-1551446591-142875a901a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
      }} />
      </React.Fragment>
    `
  },
  {
    name: "Avatar",
    comp: Avatar,
    group: "User Interface",
    example: `
    <Flex>
    <Avatar
    source={{
      uri:
        "https://images.unsplash.com/photo-1550794119-0e83682d0be2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80"
    }}
  />
  <Avatar
    size={30}
    char="U"
    marginTop="20px"
    color="#FFF"
  />
  <Avatar
    relative
    char="U"
    marginTop="20px"
    color="#FFF"
    source={{
      uri:
        "https://images.unsplash.com/photo-1529680459049-bf0340fa0755?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
    }}
  >
    <Box border="3px solid"
    borderColor="primary"
    borderColorLightness={0.96} 
    backgroundColor="success" width="20px" height="20px" borderRadius="10px" right="0" bottom="0" position="absolute" />
  </Avatar>
      </Flex>
    `
  },
  {
    name: "Button",
    comp: Button,
    group: "User Interface",
    example: `
    <React.Fragment>
        <Button marginRight="10px">text</Button>
        <Button marginRight="10px" disabled>
          text
        </Button>
        <Button marginRight="10px" loading>
          text
        </Button>
      </React.Fragment>
    `
  },
  {
    name: "Progress",
    comp: Progress,
    group: "User Interface",
    example: `
      <Flex>
        <Progress progress={10} circleWidth={20} trackWidth={30} />
        <Progress progress={90} angle={180} rotate={-45} circleWidth={10} trackWidth={10} marginTop={20} />
        <Progress marginTop={20} circleWidth={20} trackWidth={30} loading />
        <Progress circleColor="#FFF" size={30} marginTop={20} circleWidth={5} trackWidth={6} loading />
      </Flex>
    `
  },
  {
    name: "Switch",
    comp: Switch,
    group: "User Interface",
    example: `
      <Flex>
        <Switch />
        <Switch circleSize={50} marginTop="20px" />
      </Flex>
    `
  },
  {
    name: "Swiper",
    comp: Swiper,
    group: "User Interface",
    example: `
    <React.Fragment>
        <Swiper dots dotsOffset={-10} autoplay>
        <Box width="100%" height="200px" backgroundColor="primary" />
        <Box width="100%" height="200px" backgroundColor="primary" backgroundColorLightness={0.8} />
        <Box width="100%" height="200px" backgroundColor="primary" backgroundColorLightness={0.5} />
        </Swiper>

        <Swiper marginTop="30px" height="500px" width="100%" index={0} dots dotsPosition="left" vertical>
            <Box
              width="100%"
              height="100px"
              backgroundColor="primary"
              padding={50}
              borderRadius={30}
            />
            <Box
              width="100%"
              height="100px"
              backgroundColor="primary"
              padding={50}
              backgroundColorLightness={0.8}
            />
            <Box
              width="100%"
              height="100px"
              backgroundColor="primary"
              backgroundColorLightness={0.5}
            >
              <Animate onVisible>
                <Text>HI</Text>
              </Animate>
            </Box>
          </Swiper>
      </React.Fragment>
    `
  }
];

const ButtonWithTheme = props => {
  const theme = useTheme();
  return (
    <Button onPress={() => theme.alert({ type: "error", message: "fidosn" })}>
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
    sliderValue: 20,
    date: false
  });

  const theme = useTheme();
  console.log({ theme });

  return (
    <UniProvider
      theme={{
        yolo: true,
        colors: {
          primary: "#FF6B87",
          text: "#000"
        }
      }}
    >
      <Flex flexDirection="row">
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
      <Slider
        value={state.sliderValue}
        onChange={value => setState({ sliderValue: value })}
        showTicks={false}
      />

      <ButtonWithTheme />
      <Button onPress={() => setState({ ...state, date: true })}>
        Open DatePicker
      </Button>
      <Input label="Datepicker" error={"text"}>
        <DatePicker value={new Date()} placeholder="test" />
      </Input>
      <Input label="Datepicker">
        <TextInput placeholder="test" value="yolo" />
      </Input>
      <Input label="Datepicker">
        <TextInput
          placeholder="test"
          value="yolo"
          multiline
          numberOfLines={3}
        />
      </Input>
      <Input label="Datepicker" desc="This is active">
        <Switch />
      </Input>
      <DatePicker
        placeholder="test"
        value={new Date()}
        visible={state.date}
        onClose={() => setState({ ...state, date: false })}
      />
      <Icon
        onPress={() => {
          alert("hi");
        }}
      />
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
//             <Text>yarn add react-native-web react-art</Text>
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
