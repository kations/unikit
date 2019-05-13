import "date-input-polyfill";
import React, { useState, useEffect, Fragment } from "react";
import { useSpring, animated } from "react-spring";
import PropTypes from "prop-types";
import { View, Platform, StyleSheet } from "react-native-web";
import { createElement } from "react-native-web";
import dayjs from "dayjs";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import TextInput from "./TextInput";
import Overlay from "../ui/Overlay";
import Button from "../ui/Button";

const DateInput = props => createElement("input", props);

const Comp = props => {
  const {
    value,
    onChange,
    circleSize,
    style,
    visible,
    onClose,
    placeholder,
    time,
    ...rest
  } = props;

  const theme = useTheme();
  const { switcher, track, circle } = defaultStyle(props, theme);

  const [active, setActive] = useState(value || false);

  const { left, opacity } = useSpring({
    to: { left: active ? circleSize : 0, opacity: active ? 1 : 0 }
  });

  useEffect(() => {
    setActive(value);
  }, [value]);

  console.log(Platform.OS);

  const InputComp = Platform.OS === "web" ? DateInput : TextInput;
  const format = time === true ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD";

  return (
    <Fragment>
      <TextInput
        as={Platform.OS === "web" ? "input" : undefined}
        value={value ? dayjs(value).format(format) : undefined}
        placeholder={placeholder}
        type={time === true ? "datetime-local" : "date"}
      />
      {/* <Overlay
        position="bottom"
        height="auto"
        visible={visible}
        onClose={onClose || null}
        padding="20px"
        backdrop
        usePan={false}
        content={() => (
          <Box width="100%">
            <Button onPress={onClose || null}>Fertig</Button>
          </Box>
        )}
        {...rest}
      /> */}
    </Fragment>
  );
};

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    switcher: {
      position: "relative",
      display: Platform.OS === "web" ? "inline-block" : "flex",
      backgroundColor: getProp(props, theme, "backgroundColor", "switch"),
      overflow: "hidden",
      width:
        getProp(props, theme, "circleSize", "switch") * 2 +
        getProp(props, theme, "borderSize", "switch") * 2,
      height:
        getProp(props, theme, "circleSize", "switch") +
        getProp(props, theme, "borderSize", "switch") * 2,
      padding: getProp(props, theme, "borderSize", "switch"),
      borderRadius: getProp(props, theme, "borderRadius", "switch")
    },
    track: {
      position: "relative",
      width: "100%",
      height: "100%"
    },
    circle: {
      position: "absolute",
      top: "50%",
      width: getProp(props, theme, "circleSize", "switch"),
      height: getProp(props, theme, "circleSize", "switch"),
      marginTop: -getProp(props, theme, "circleSize", "switch") / 2,
      borderRadius: getProp(props, theme, "circleSize", "switch") / 2,
      backgroundColor: "#fff"
    }
  });

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  circleSize: PropTypes.number,
  borderSize: PropTypes.number,
  onChange: PropTypes.func
};

Comp.defaultProps = {
  circleSize: 30,
  backgroundColor: "background"
};

export default Comp;
