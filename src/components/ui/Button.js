import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import styled, {withTheme} from "styled-components";

import PropTypes from "prop-types";

import { getProp, getColorSchema } from "../../helper";
import Flex from "../primitives/Flex";
import Text from "../primitives/Text";
import Gradient from "./Gradient";
import Progress from "./Progress";

// import styles from "./styles.css";

const Button = styled(Flex)`
  padding: 0 ${p => getProp(p, "size", "button") / 2}px;
  height: ${p => getProp(p, "size", "button")}px;
  width: auto;
  background-color: ${p => getProp(p, 'backgroundColor', "button")};
  opacity: ${p => (p.disabled && !p.loading ? 0.5 : 1)};
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(Text)`
position: relative;
z-index: 10;
  color: ${p =>
    getColorSchema(
      p,
      getProp(p, 'mode', "button"),
      p.light ? "light" : "background"
    ).text};
  font-size: ${p => getProp(p, "size", "button") / 3.25}px;
`;

const Comp = (props) => {
  const {
    mode,
    children,
    style,
    onPress,
    inline,
    activeOpacity,
    disabled,
    light,
    colors,
    color,
    loading,
    ...rest,
  } = props;
  return (
    <Button
      as={TouchableOpacity}
      style={style}
      disabled={disabled || loading}
      loading={loading}
      onPress={disabled ? null : onPress || null}
      onMouseEnter={() => console.log("hover")}
      activeOpacity={getProp(props, "activeOpacity", "button")}
      inline={getProp(props, "inline", "button")}
      comp="button"
      {...rest}
    >
      <Gradient borderRadius={props.borderRadius} opacity={props.disabled ? 0.25 : 1} />
      {loading ? <Progress size={20} trackWidth={2} circleWidth={2} trackColor="transparent" circleColor="#FFF" loading /> : <ButtonText numberOfLines={1} color={color}>
        {children}
      </ButtonText>}
    </Button>
  );
};

Comp.propTypes = {
  mode: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  light: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
  colors: PropTypes.array,
};

Comp.defaultProps = {
  loading: false,
  borderRadius: 22,
}

console.log(Comp.propTypes)

export default withTheme(Comp);
