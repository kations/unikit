import React, { Fragment } from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import PropTypes from "prop-types";

import { getColorMode } from "../../helper";
import { useTheme } from "../../style/Theme";

import Progress from "./Progress";
import styled from "../../style/styled";

const Button = styled.View(({ theme, disabled, loading, size, color }) => ({
  display: Platform.OS === "web" ? "inline-flex" : "flex",
  paddingHorizontal: size / 2,
  height: size,
  width: "auto",
  backgroundColor: color,
  opacity: disabled && !loading ? 0.5 : 1,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  borderRadius: theme.globals.roundness
}));

const ButtonText = styled.Text(({ textColor, size }) => ({
  color: textColor,
  fontSize: size / 3.25
}));

const Comp = props => {
  const {
    as,
    children,
    disabled,
    loading,
    onPress,
    renderLeft,
    renderRight,
    size,
    onMouseEnter,
    color,
    progressProps,
    buttonTextProps,
    pill,
    ...rest
  } = props;

  const theme = useTheme();

  return (
    <Button
      as={as || pill ? undefined : TouchableOpacity}
      onPress={disabled || loading ? null : onPress || null}
      disabled={disabled}
      loading={loading}
      onMouseEnter={e => {
        if (onMouseEnter) onMouseEnter(e);
        console.log("hover");
      }}
      size={size}
      color={color}
      {...rest}
    >
      {loading ? (
        <Progress
          circleColor={
            getColorMode(theme.colors[color] || color) === "light"
              ? "#000"
              : "#FFF"
          }
          loading
          size={20}
          trackWidth={2}
          circleWidth={2}
          trackColor="transparent"
          {...progressProps}
        />
      ) : (
        <Fragment>
          {renderLeft}
          {typeof children === "string" ? (
            <ButtonText
              textColor={
                getColorMode(theme.colors[color] || color) === "light"
                  ? "#000"
                  : "#FFF"
              }
              size={size}
              {...buttonTextProps}
            >
              {children}
            </ButtonText>
          ) : (
            children
          )}
          {renderRight}
        </Fragment>
      )}
    </Button>
  );
};

Comp.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
  progressProps: PropTypes.object,
  buttonTextProps: PropTypes.object
};

Comp.defaultProps = {
  loading: false,
  disabled: false,
  size: 48,
  color: "primary"
};

export default Comp;
