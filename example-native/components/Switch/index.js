import React, { useState, useEffect } from "react";
import styled, { withTheme } from "styled-components";
import { useSpring, animated } from "react-spring";
import { View, TouchableOpacity } from "react-native";
import { getProp } from "../../helper";

const Gradient = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: ${p => getProp(p, "primary", "colors")};
`;

const Switcher = styled(TouchableOpacity)`
  position: relative;
  display: inline-block;
  width: ${p => getProp(p, "circleSize", "switch") * 2 + 10}px;
  height: ${p => getProp(p, "circleSize", "switch") + 10}px;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.25);
  overflow: hidden;
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
  const { value, onChange, circleSize, barSize, theme, style } = props;

  const width = getProp(props, "circleSize", "switch") * 2 + 10;

  const [active, setActive] = useState(value || false);

  const { left } = useSpring({
    to: { left: active ? width / 2 : 5 }
  });

  useEffect(() => {
    setActive(value);
  }, [value]);

  return (
    <Switcher
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
    >
      {active && <Gradient />}
      <AnimatedCircle
        circleSize={circleSize}
        style={{ transform: [{ translateX: left }] }}
      />
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

export default withTheme(Comp);
