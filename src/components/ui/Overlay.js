// import React, { useState, useEffect, Fragment } from "react";
// import {
//   Dimensions,
//   Platform,
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView
// } from "react-native";
// import PropTypes from "prop-types";
// import { useTransition, useSpring, animated } from "react-spring/native";

// import { useTheme } from "../../style/Theme";
// import Portal from "../helper/Portal";
// import Box from "../primitives/Box";
// import Pan from "../helper/Pan";

// const AnimatedPan = animated(Pan);
// const AnimatedBox = animated(View);

// const getMove = (position, width, height) => {
//   if (position === "left") {
//     return -width;
//   } else if (position === "right") {
//     return width;
//   } else if (position === "top") {
//     return -height;
//   } else if (position === "bottom") {
//     return height;
//   }
// };

// const Comp = props => {
//   const {
//     width,
//     height,
//     position,
//     visible,
//     children,
//     onClose,
//     content,
//     backdrop,
//     contentMove,
//     contentMoveStyle,
//     containerStyle,
//     usePan,
//     ...rest
//   } = props;
//   const Screen = Dimensions.get("window");

//   const theme = useTheme();
//   const { back, paner, modal, handle, contents } = defaultStyle(props, theme);

//   const [state, setState] = useState({
//     width: width || Screen.width,
//     height: height || Screen.height,
//     swipe: false,
//     render: visible,
//     move: getMove(position, Screen.width, Screen.height)
//   });

//   // console.log({
//   //   move: getMove(position, Screen.width, Screen.height),
//   //   visible,
//   //   render: state.render
//   // });

//   useEffect(() => {
//     if (visible) {
//       setState({ ...state, move: 0, render: true });
//     } else {
//       setState({
//         ...state,
//         move: getMove(position, state.width, state.height)
//       });
//     }
//   }, [visible, state.width]);

//   const { move } = useSpring({
//     from: {
//       move: getMove(position, state.width, state.height)
//     },
//     to: {
//       move: state.move
//     },
//     config: { mass: 1, tension: 300, friction: 30 },
//     immediate: name => state.swipe && name === "move",
//     onRest: () => {
//       if (!visible && state.render === true && move !== 0) {
//         setState({ ...state, render: false });
//       }
//     }
//   });

//   const AnimatedBackdrop = animated(onClose ? TouchableOpacity : View);
//   const PanComp = usePan ? AnimatedPan : AnimatedBox;

//   if (!state.render) return null;

//   return (
//     <Portal>
//       <Fragment>
//         {backdrop && (
//           <AnimatedBackdrop
//             onPress={onClose || null}
//             style={StyleSheet.flatten([
//               back,
//               {
//                 opacity: move
//                   .interpolate({
//                     range: [0, getMove(position, state.width, state.height)],
//                     output: [0.8, 0]
//                   })
//                   .interpolate(o => (o ? o : 0))
//               }
//             ])}
//             aria-modal="true"
//             activeOpacity={0.8}
//             pointerEvents={visible ? "auto" : "none"}
//           />
//         )}
//         <PanComp
//           onLayout={({ nativeEvent }) => {
//             //console.log({ width: nativeEvent.layout.width });
//             setState({
//               ...state,
//               width: nativeEvent.layout.width,
//               height: nativeEvent.layout.height
//             });
//           }}
//           style={StyleSheet.flatten([
//             paner,
//             containerStyle,
//             {
//               width:
//                 position === "top" || position === "bottom"
//                   ? "100%"
//                   : state.width,
//               height:
//                 position === "top" || position === "bottom"
//                   ? state.height
//                   : "100%",
//               transform: move.interpolate(m =>
//                 position === "top" || position === "bottom"
//                   ? [{ translateY: m }]
//                   : [{ translateX: m }]
//               )
//             }
//           ])}
//           onStart={() => {
//             setState({
//               ...state,
//               swipe: true
//             });
//           }}
//           onSwipe={(direction, gestureState) => {
//             const { dx, dy } = gestureState;
//             //console.log(gestureState, dx, dy);
//             setState({
//               ...state,
//               move: position === "top" || position === "bottom" ? dy : dx
//             });
//           }}
//           onSwipeEnd={(direction, gestureState) => {
//             const threshold = 0;
//             const { vx, vy } = gestureState;
//             var visible =
//               state.move < getMove(position, state.width, state.height) / 2
//                 ? false
//                 : true;

//             if (position === "right" || position === "bottom") {
//               visible =
//                 state.move > getMove(position, state.width, state.height) / 2
//                   ? false
//                   : true;
//             }

//             // Quick movement
//             if (Math.abs(vx) * 10 > threshold) {
//               if (
//                 (vx > 0 && position === "left") ||
//                 (vx < 0 && position === "right") ||
//                 (vy < 0 && position === "top") ||
//                 (vy < 0 && position === "bottom")
//               ) {
//                 visible = true;
//               } else {
//                 visible = false;
//               }
//             }
//             if (!visible && onClose) onClose();
//             setState({
//               ...state,
//               move: visible ? 0 : getMove(position, state.width, state.height),
//               visible: visible,
//               swipe: false
//             });
//           }}
//         >
//           <Box
//             as={SafeAreaView}
//             style={modal}
//             onPress={null}
//             activeOpacity={1}
//             comp="overlay"
//             {...rest}
//           >
//             {usePan ? <Box style={handle} /> : null}
//             {children}
//           </Box>
//         </PanComp>
//       </Fragment>
//     </Portal>
//   );
// };

// const handePosition = {
//   bottom: {
//     top: 10,
//     left: "50%",
//     marginLeft: -25
//   },
//   left: {
//     right: 10,
//     top: "50%",
//     marginTop: -25
//   },
//   right: {
//     left: 10,
//     top: "50%",
//     marginTop: -25
//   },
//   top: {
//     bottom: 10,
//     left: "50%",
//     marginLeft: -25
//   }
// };

// const safePan = {
//   bottom: {
//     paddingTop: 20
//   },
//   left: {
//     paddingRight: 20
//   },
//   right: {
//     paddingLeft: 20
//   },
//   top: {
//     paddingBottom: 20
//   }
// };

// const defaultStyle = (props, theme) =>
//   StyleSheet.create({
//     back: {
//       position: Platform.OS === "web" ? "fixed" : "absolute",
//       left: 0,
//       top: 0,
//       width: "100%",
//       height: "100%",
//       backgroundColor: "rgba(0, 0, 0, 0.25)",
//       zIndex: props.zIndex
//     },
//     paner: {
//       position: Platform.OS === "web" ? "fixed" : "absolute",
//       left: props.position !== "right" ? 0 : "auto",
//       right: props.position === "right" ? 0 : "auto",
//       bottom: props.position === "bottom" ? 0 : "auto",
//       top: props.position !== "bottom" ? 0 : "auto",
//       zIndex: props.zIndex + 10
//     },
//     modal: {
//       backgroundColor: "#fff",
//       width: "100%",
//       height: "100%",
//       ...safePan[props.position]
//     },
//     handle: {
//       position: "absolute",
//       ...handePosition[props.position],
//       width: props.position === "bottom" || props.position === "top" ? 50 : 6,
//       height: props.position === "bottom" || props.position === "top" ? 6 : 50,
//       borderRadius: 5,
//       backgroundColor: "rgba(0, 0, 0, 0.1)"
//     },
//     contents: {
//       flex: 1
//     }
//   });

// Comp.propTypes = {
//   mode: PropTypes.string,
//   disabled: PropTypes.bool,
//   onPress: PropTypes.func,
//   light: PropTypes.bool,
//   style: PropTypes.object
// };

// Comp.defaultProps = {
//   contentMoveStyle: "transform",
//   backdrop: true,
//   position: "bottom",
//   contentMove: 0.5,
//   zIndex: 100,
//   usePan: true
// };

// export default Comp;

import React, { useState, useEffect, Fragment } from "react";
import {
  Dimensions,
  Platform,
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import { useTransition, useSpring, animated } from "react-spring";

import { useTheme } from "../../style/Theme";
import Portal from "../helper/Portal";
import Box from "../primitives/Box";
import Pan from "../helper/Pan";
import styled from "../../style/styled";

const AnimatedBox = animated(Box);
const AnimatedBackdrop = animated(Box);
const AnimatedTouchableBackdrop = animated(styled.View());

const getMove = (position, width, height) => {
  if (position === "left") {
    return -width;
  } else if (position === "right") {
    return width;
  } else if (position === "top") {
    return -height;
  } else if (position === "bottom") {
    return height;
  }
};

const Comp = props => {
  const {
    width,
    height,
    position,
    visible,
    children,
    onClose,
    content,
    backdrop,
    contentMove,
    contentMoveStyle,
    containerStyle,
    usePan,
    ...rest
  } = props;
  const Screen = Dimensions.get("window");

  const theme = useTheme();
  const { back, paner, modal, handle, contents } = defaultStyle(props, theme);

  const [show, set] = useState(visible);

  useEffect(() => {
    set(visible);
  }, [visible]);

  const moves = {
    bottom: Screen.height,
    center: Screen.height,
    top: -Screen.height,
    left: -Screen.width,
    right: Screen.width
  };

  const transitions = useTransition(show, null, {
    from: {
      opacity: 0,
      move: moves[position]
    },
    enter: { opacity: 1, move: 0 },
    leave: {
      opacity: 0,
      move: moves[position]
    }
  });

  return (
    <Portal>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <View key={key}>
              <TouchableOpacity onPress={onClose || null} activeOpacity={0.8}>
                <AnimatedBackdrop
                  style={{
                    position: Platform.OS !== "web" ? "absolute" : "fixed",
                    left: 0,
                    bottom: 0,
                    width: Screen.width,
                    height: Screen.height,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    opacity: props.opacity
                  }}
                  pointerEvents={visible ? "auto" : "none"}
                />
              </TouchableOpacity>
              <AnimatedBox
                key={key}
                width={Screen.width}
                height={Screen.height}
                style={StyleSheet.flatten([
                  paner,
                  {
                    transform: props.move.interpolate(m =>
                      position === "top" ||
                      position === "bottom" ||
                      position === "center"
                        ? [{ translateY: m }]
                        : [{ translateX: m }]
                    )
                  }
                ])}
                pointerEvents={"box-none"}
              >
                <Box
                  style={modal}
                  onPress={null}
                  activeOpacity={1}
                  width={width || Screen.width}
                  height={height || Screen.height}
                  comp="overlay"
                  pointerEvents="auto"
                  backgroundColor="surface"
                  {...rest}
                >
                  {usePan ? <Box style={handle} /> : null}
                  {children}
                </Box>
              </AnimatedBox>
            </View>
          )
      )}
    </Portal>
  );
};

const handePosition = {
  bottom: {
    top: 10,
    left: "50%",
    marginLeft: -25
  },
  left: {
    right: 10,
    top: "50%",
    marginTop: -25
  },
  right: {
    left: 10,
    top: "50%",
    marginTop: -25
  },
  top: {
    bottom: 10,
    left: "50%",
    marginLeft: -25
  }
};

const safePan = {
  bottom: {
    paddingTop: 20
  },
  left: {
    paddingRight: 20
  },
  right: {
    paddingLeft: 20
  },
  top: {
    paddingBottom: 20
  }
};

const flexStyle = {
  bottom: {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  left: {
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    back: {
      position: Platform.OS === "web" ? "fixed" : "absolute",
      left: 0,
      top: 0,
      width: 500,
      height: 500,
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      zIndex: props.zIndex + 5
    },
    paner: {
      ...flexStyle[props.position],
      position: Platform.OS === "web" ? "fixed" : "absolute",
      left: 0,
      bottom: 0,
      zIndex: props.zIndex + 10
    },
    modal: {
      ...safePan[props.position]
    },
    handle: {
      position: "absolute",
      ...handePosition[props.position],
      width: props.position === "bottom" || props.position === "top" ? 50 : 6,
      height: props.position === "bottom" || props.position === "top" ? 6 : 50,
      borderRadius: 5,
      backgroundColor: "rgba(0, 0, 0, 0.1)"
    },
    contents: {
      flex: 1
    }
  });

Comp.propTypes = {
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object
};

Comp.defaultProps = {
  contentMoveStyle: "transform",
  backdrop: true,
  position: "bottom",
  contentMove: 0.5,
  zIndex: 100,
  usePan: false
};

export default Comp;
