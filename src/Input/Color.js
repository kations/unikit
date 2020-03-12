import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import tinycolor from "tinycolor2";

import styled, { useTheme, withThemeProps } from "../styled";
import { useUpdateEffect } from "../hooks";

import { isDark } from "../util";
import TextInput from "./Text";
import Overlay from "../Overlay";
import Button from "../Button";
import Box from "../Box";
import Flex from "../Flex";
import Icon from "../Icon";
import Grid from "../Grid";
import Slider from "./Slider";

const Label = styled.Text(({ color, size }) => ({
  color: color,
  font: "label",
  color: "text",
  paddingBottom: 5,
  paddingTop: 10
}));

const Gradient = ({ gradientSteps, maximumValue, getStepColor, ...rest }) => {
  const rows = [];
  for (let i = 0; i <= gradientSteps; i++) {
    rows.push(
      <Flex
        key={i}
        style={{
          flex: 1,
          backgroundColor: getStepColor((i * maximumValue) / gradientSteps)
        }}
      />
    );
  }
  return (
    <Flex w="100%" h="100%" row {...rest}>
      {rows}
    </Flex>
  );
};

const HueGradient = ({ style, gradientSteps }) => {
  return (
    <Gradient
      style={style}
      gradientSteps={gradientSteps}
      getStepColor={i => tinycolor({ s: 1, l: 0.5, h: i }).toHslString()}
      maximumValue={359}
    />
  );
};

const SaturationGradient = ({ style, gradientSteps, color }) => {
  return (
    <Gradient
      style={style}
      gradientSteps={gradientSteps}
      getStepColor={i => tinycolor({ ...color, s: i }).toHslString()}
      maximumValue={1}
    />
  );
};

const LightnessGradient = ({ style, gradientSteps, color }) => {
  return (
    <Gradient
      style={style}
      gradientSteps={gradientSteps}
      getStepColor={i => tinycolor({ ...color, l: i }).toHslString()}
      maximumValue={1}
    />
  );
};

const Color = withThemeProps(
  ({
    value,
    onChange,
    style,
    setFocus,
    overlayProps = {},
    inputProps = {},
    saveAs = "hex",
    cancelText = "Cancel",
    saveText = "Save",
    showVariants = true,
    ...rest
  }) => {
    const [color, setColor] = useState(tinycolor(value).toHsl());
    const theme = useTheme();
    const [visible, setVisible] = useState(false);

    useUpdateEffect(() => {
      setColor(tinycolor(value).toHsl());
    }, [value]);

    const defaultColors = tinycolor(color)
      .monochromatic()
      .map(t => t.toHexString());

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
          contentProps={{ maxWidth: 500, w: "90%", bg: "surface" }}
          {...overlayProps}
        >
          <Box width="100%">
            <Label>Selected Color</Label>
            <Flex
              w="100%"
              h={100}
              p={15}
              justifyContent="flex-end"
              alignItems="flex-start"
              borderRadius={theme.globals.roundness}
              borderColor="text"
              borderColorAlpha={0.05}
              bg={tinycolor(color).toHexString()}
            >
              <Button
                bg={
                  tinycolor(color).getBrightness() < 199
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)"
                }
                color={tinycolor(color).getBrightness() < 199 ? "#FFF" : "#000"}
              >
                {saveAs === "hex"
                  ? tinycolor(color).toHexString()
                  : tinycolor(color).toRgbString()}
              </Button>
            </Flex>
            <Label>Hue</Label>
            <Slider
              renderTrack={() => <HueGradient gradientSteps={50} />}
              value={color.h}
              max={359}
              onChange={h => setColor({ ...color, h })}
              onSwipe={(p, h) => setColor({ ...color, h })}
              showTicks={false}
            />
            <Label>Lightness</Label>
            <Slider
              renderTrack={() => (
                <LightnessGradient color={color} gradientSteps={50} />
              )}
              value={color.l}
              max={1}
              steps={0.1}
              onChange={l => setColor({ ...color, l })}
              onSwipe={(p, l) => setColor({ ...color, l })}
              showTicks={false}
            />

            <Label>Saturation</Label>
            <Slider
              renderTrack={() => (
                <SaturationGradient color={color} gradientSteps={50} />
              )}
              value={color.s}
              max={1}
              steps={0.1}
              onChange={s => setColor({ ...color, s })}
              onSwipe={(p, s) => setColor({ ...color, s })}
              showTicks={false}
            />
            {value && showVariants ? (
              <Fragment>
                <Label>Variants</Label>
                <Grid min={44} gap={theme.globals.gap / 2}>
                  {defaultColors.map((col, index) => (
                    <Box
                      key={index}
                      as={TouchableOpacity}
                      style={{
                        width: "100%",
                        height: 44,
                        borderRadius: 5,
                        backgroundColor: col,
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.1)"
                      }}
                      onPress={() => {
                        setColor(tinycolor(col).toHsl());
                      }}
                    />
                  ))}
                </Grid>
              </Fragment>
            ) : null}
            <Flex w="100%" mt={20} row>
              <Button
                flex={1}
                mr={theme.globals.gap / 2}
                onPress={() => {
                  setVisible(false);
                  setColor(tinycolor(value).toHsl());
                }}
                bg="error"
                light
              >
                {cancelText}
              </Button>
              <Button
                flex={1}
                ml={theme.globals.gap / 2}
                onPress={() => {
                  setVisible(false);
                  if (onChange) {
                    if (saveAs === "hex") {
                      onChange(tinycolor(color).toHexString());
                    } else {
                      onChange(tinycolor(color).toRgbString());
                    }
                  }
                }}
              >
                {saveText}
              </Button>
            </Flex>
          </Box>
        </Overlay>
      </Fragment>
    );
  },
  "Color"
);

Color.propTypes = {
  value: PropTypes.string,
  style: PropTypes.object,
  borderSize: PropTypes.number,
  onChange: PropTypes.func
};

export default Color;
