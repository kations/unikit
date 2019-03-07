import React, { useState, useEffect } from "react";
import styled, { withTheme } from "styled-components";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { View, TouchableOpacity } from "react-native";

import { getProp } from "../../helper";
import Block from "../primitives/Block";

import Gradient from "./Gradient";

const Switcher = styled(Block)`
  position: relative;
  display: inline-block;
  width: ${p =>
    getProp(p, "circleSize", "switch") * 2 +
    getProp(p, "borderSize", "switch") * 2}px;
  height: ${p =>
    getProp(p, "circleSize", "switch") +
    getProp(p, "borderSize", "switch") * 2}px;
  padding: ${p => getProp(p, "borderSize", "switch")}px;
  border-radius: ${p => getProp(p, "borderRadius", "switch")}px;
  background-color: rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const SwitcherTrack = styled(Block)`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Circle = styled(View)`
  position: absolute;
  top: 50%;
  width: ${p => getProp(p, "circleSize", "switch")}px;
  height: ${p => getProp(p, "circleSize", "switch")}px;
  margin-top: -${p => getProp(p, "circleSize", "switch") / 2}px;
  border-radius: 30px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const AnimatedCircle = animated(Circle);

const Comp = props => {
  const { value, onChange, circleSize, style, ...rest } = props;

  const [active, setActive] = useState(value || false);

  const { left } = useSpring({
    to: { left: active ? 50 : 0 }
  });

  useEffect(() => {
    setActive(value);
  }, [value]);

  return (
    <Switcher
      as={TouchableOpacity}
      style={style}
      activeOpacity={0.8}
      circleSize={circleSize}
      onPress={() => {
        const newValue = !active;
        setActive(newValue);
        setTimeout(() => {
          if (onChange) {
            onChange(newValue);
          }
        }, 299);
      }}
      {...rest}
    >
      {active && <Gradient />}
      <SwitcherTrack>
        <AnimatedCircle
          circleSize={circleSize}
          style={{ left: left.interpolate(l => `${l}%`) }}
        />
      </SwitcherTrack>
    </Switcher>
  );
};

// class Comp extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       value: props.value
//     };
//   }
//   render() {
//     const { value, onChange, circleSize, style } = this.props;

//     console.log(circleSize);

//     const width = getProp(this.props, "circleSize", "switch") * 2 + 10;

//     return (
//       <Spring
//         to={{ left: this.state.value ? width / 2 : 5 }}
//         config={{ duration: 200 }}
//       >
//         {props => {
//           return (
//             <Switcher
//               style={style}
//               circleSize={circleSize}
//               activeOpacity={0.8}
//               onPress={() => {
//                 this.setState({ value: !this.state.value });
//                 // setTimeout(() => {
//                 //   if (onChange) {
//                 //     onChange(!value);
//                 //   }
//                 // }, 299);
//               }}
//             >
//               {this.state.value && <Gradient />}
//               <AnimatedCircle
//                 circleSize={circleSize}
//                 style={{ transform: [{ translateX: props.left }] }}
//               />
//             </Switcher>
//           );
//         }}
//       </Spring>
//     );
//   }
// }

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  circleSize: PropTypes.number,
  borderSize: PropTypes.number,
  onChange: PropTypes.func
};

export default Comp;
