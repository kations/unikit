import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

import { isDark } from "../util";
import TextInput from "./Text";
import Overlay from "../Overlay";
import Button from "../Button";
import Box from "../Box";
import Icon from "../Icon";
import Grid from "../Grid";

const Comp = ({
  value,
  onChange,
  style,
  defaultColors,
  setFocus,
  overlayProps = {},
  inputProps = {},
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Fragment>
      <Box w="100%" relative {...rest}>
        <TextInput
          value={value}
          setFocus={setFocus}
          onChange={onChange}
          {...inputProps}
        />
        <Box
          bg={value || "#FFF"}
          as={TouchableOpacity}
          style={{
            position: "absolute",
            right: 0,
            top: "10%",
            minWidth: 60,
            height: "80%",
            borderRadius: 20,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.1)",
            alignItems: "flex-end",
            justifyContent: "center"
          }}
          onPress={() => setVisible(true)}
        >
          <Icon
            name="arrowDown"
            color={isDark(value) ? "#FFF" : "#000"}
            size={15}
          />
        </Box>
      </Box>
      <Overlay
        visible={visible}
        height="auto"
        onClose={() => setVisible(false)}
        p={20}
        style={{ maxWidth: 500, width: "90%" }}
        {...overlayProps}
      >
        <Box width="100%">
          <Grid min={88}>
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
  value: PropTypes.string,
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
