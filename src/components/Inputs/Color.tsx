import * as React from 'react';
import tinycolor from 'tinycolor2';

import { withThemeProps, Touchable } from '../../style';
import { useUpdateEffect, useDebounce } from '../../hooks';
import { colorAware } from '../../util';
import Button from '../Button';
import Flex from '../Flex';
import Icon from '../Icon';
import Grid from '../Grid';
import Slider from './Slider';
import Text from '../Text';
import Tooltip from '../Tooltip';
import Gradient from '../Gradient';

const HLSGradient = ({
  style,
  steps = 25,
  max = 359,
  color = { s: 1, l: 0.5 },
  hslKey = 'h',
}) => {
  const colors = React.useMemo(() => {
    return Array.from(Array(steps).keys()).map((i) =>
      tinycolor({
        ...color,
        [hslKey]: (i * max) / steps,
      }).toHslString()
    );
  }, [color]);
  return <Gradient style={style} colors={colors} />;
};

const Color = ({
  theme,
  value,
  onChange,
  style,
  setFocus,
  overlayProps = {},
  inputProps = {},
  saveAs = 'hex',
  cancelText = 'Cancel',
  saveText = 'Save',
  showVariants = true,
  ...rest
}) => {
  const [color, setColor] = React.useState(tinycolor(value).toHsl());
  const [visible, setVisible] = React.useState(false);

  const debouncedColor = useDebounce(color, 300);

  useUpdateEffect(() => {
    if (onChange) {
      if (saveAs === 'hex') {
        onChange(tinycolor(debouncedColor).toHexString());
      } else {
        onChange(tinycolor(debouncedColor).toRgbString());
      }
    }
  }, [debouncedColor]);

  const defaultColors = tinycolor(color)
    .monochromatic()
    .map((t) => t.toHexString());

  const sliders = [
    { label: 'Hue', key: 'h', max: 359 },
    { label: 'Lightness', key: 'l', max: 1, steps: 0.01, color },
    { label: 'Saturation', key: 's', max: 1, steps: 0.01, color },
  ];

  const sliderProps = {
    progressColor: tinycolor(color).toHexString(),
    hideProgressTrack: true,
    showTicks: false,
  };

  return (
    <Tooltip
      width={400}
      color="input"
      useScrollView
      popover={
        <Flex width="100%">
          <Text font="label" mb={5} webStyle={{ userSelect: 'none' }}>
            Selected Color
          </Text>
          <Flex
            w="100%"
            h={100}
            p={15}
            justifyContent="flex-end"
            alignItems="flex-start"
            borderRadius={theme.globals.roundness}
            borderColor="text"
            borderColorAlpha={0.05}
            style={{ backgroundColor: tinycolor(color).toHexString() }}
          >
            <Button
              bg={
                tinycolor(color).getBrightness() < 199
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)'
              }
              color={tinycolor(color).getBrightness() < 199 ? '#FFF' : '#000'}
            >
              {saveAs === 'hex'
                ? tinycolor(color).toHexString()
                : tinycolor(color).toRgbString()}
            </Button>
          </Flex>
          {sliders.map(({ key, label, max, steps = 1, ...rest }) => (
            <Flex w="100%" key={key}>
              <Text font="label" mt={5}>
                {label}
              </Text>
              <Slider
                renderTrack={<HLSGradient hslKey={key} max={max} {...rest} />}
                value={color[key]}
                max={max}
                steps={steps}
                onChange={(h) => setColor((c) => ({ ...c, [key]: h }))}
                onSlide={(h) => setColor({ ...color, [key]: h })}
                {...sliderProps}
              />
            </Flex>
          ))}
          {value && showVariants ? (
            <>
              <Text font="label" my={5}>
                Variants
              </Text>
              <Grid min={44} gap={theme.globals.gap / 2} outerGap={false}>
                {defaultColors.map((col, index) => (
                  <Touchable
                    key={index}
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: 5,
                      backgroundColor: col,
                      borderWidth: 1,
                      borderColor: 'rgba(0,0,0,0.1)',
                      marginBottom: 10,
                    }}
                    onPress={() => {
                      setColor(tinycolor(col).toHsl());
                    }}
                  />
                ))}
              </Grid>
            </>
          ) : null}
        </Flex>
      }
    >
      <Flex
        height={44}
        style={{
          minWidth: 60,
          borderRadius: theme.globals.roundness,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: value || '#FFF',
        }}
        onPress={() => {
          setVisible(true);
        }}
        {...rest}
      >
        <Icon
          name="chevron-down"
          color={colorAware(value || '#FFF', theme)}
          size={15}
        />
      </Flex>
    </Tooltip>
  );
};

export default withThemeProps(Color, 'Color');
