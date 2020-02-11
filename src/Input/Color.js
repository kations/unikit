import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

import { useTheme } from "../styled";
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
  defaultColors = [
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
  ],
  setFocus,
  overlayProps = {},
  inputProps = {},
  ...rest
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <Fragment>
      <Box
        w="100%"
        row
        items="center"
        br={theme.globals.roundness}
        relative
        {...rest}
      >
        <TextInput
          value={value}
          setFocus={setFocus}
          onChange={onChange}
          {...inputProps}
        />
        <Box p={theme.globals.inputGap / 2} h="100%" t={0} r={0} absolute>
          <Box
            bg={value || "#FFF"}
            as={TouchableOpacity}
            style={{
              minWidth: 60,
              height: "100%",
              borderRadius: theme.globals.roundness,
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
              color={isDark(value || "#FFF") ? "#FFF" : "#000"}
              size={15}
            />
          </Box>
        </Box>
      </Box>
      <Overlay
        visible={visible}
        height="auto"
        onClose={() => setVisible(false)}
        contentProps={{ p: 20, maxWidth: 500, w: "90%", bg: "surface" }}
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

export default Comp;
