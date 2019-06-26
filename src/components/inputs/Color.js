import React, { useState, useEffect, Fragment } from "react";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { View, Platform, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "../../style/Theme";
import { getColorMode } from "../../helper";
import TextInput from "./TextInput";
import Overlay from "../ui/Overlay";
import Button from "../ui/Button";
import Box from "../primitives/Box";
import Icon from "../ui/Icon";
import Grid from "../ui/Grid";

const Comp = props => {
  const { value, onChange, style, defaultColors, ...rest } = props;

  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  return (
    <Fragment>
      <Box width="100%" position="relative">
        <TextInput value={value} onChange={onChange} {...rest} />
        <Box
          as={TouchableOpacity}
          style={{
            position: "absolute",
            right: 0,
            top: "10%",
            minWidth: 60,
            height: "80%",
            borderRadius: 20,
            paddingHorizontal: 8,
            backgroundColor: value || "#FFF",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.1)",
            alignItems: "flex-end",
            justifyContent: "center"
          }}
          onPress={() => setVisible(true)}
        >
          <Icon
            type="arrowDown"
            color={getColorMode(value) === "light" ? "#000" : "#FFF"}
            size={15}
          />
        </Box>
      </Box>
      <Overlay
        position="bottom"
        height="auto"
        visible={visible}
        onClose={() => setVisible(false)}
        padding={20}
        backdrop
        {...rest}
      >
        <Box width="100%">
          <Grid min={44}>
            {defaultColors.map((color, index) => (
              <Box
                key={index}
                as={TouchableOpacity}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 5,
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.1)"
                }}
                onPress={() => {
                  onChange(color);
                  setVisible(false);
                }}
              />
            ))}
          </Grid>
          <Button onPress={() => setVisible(false)}>Fertig</Button>
        </Box>
      </Overlay>
    </Fragment>
  );
};

Comp.propTypes = {
  value: PropTypes.srting,
  style: PropTypes.object,
  borderSize: PropTypes.number,
  onChange: PropTypes.func
};

Comp.defaultProps = {
  value: "#FFF",
  defaultColors: [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b"
  ]
};

export default Comp;
