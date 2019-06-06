import React, { useState, useEffect, Fragment } from "react";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { View, Platform, StyleSheet } from "react-native";
import { createElement } from "react-native";
import dayjs from "dayjs";

import { useTheme } from "../../style/Theme";
import { getProp } from "../../helper";
import TextInput from "./TextInput";

const DateInput = props => createElement("input", props);

const Comp = props => {
  const { value, style, time, ...rest } = props;

  const format = time === true ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD";

  return (
    <Fragment>
      <TextInput
        as={Platform.OS === "web" ? DateInput : undefined}
        value={value ? dayjs(value).format(format) : undefined}
        type={time === true ? "datetime-local" : "date"}
        editable={false}
        {...rest}
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

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  onChange: PropTypes.func
};

Comp.defaultProps = {
  circleSize: 30
};

export default Comp;
