import * as React from 'react';

import Reanimated, {
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';
import { withThemeProps, Pressable, transformColor } from '../../style';

import Flex from '../Flex';
import Draggable from '../Draggable';
import { isNumber } from '../../util';

const AnimatedTrack = Reanimated.createAnimatedComponent(Flex);

interface Props {
  theme: object;
  value: boolean;
  onChange: void;
  size?: number;
  roundness?: number;
  gap?: number;
  trackColor?: string;
  activeTrackColor?: string;
  handleShow?: number;
  renderHandleContent: React.ReactNode;
  disabled?: boolean;
  [key: string]: any;
}

const Track = ({ activeTrackColor, translationX, size, theme, ...rest }) => {
  const c1 = transformColor({
    value: 'input',
    theme,
    themeKey: 'colors',
  });
  const c2 = transformColor({
    value: activeTrackColor,
    theme,
    themeKey: 'colors',
  });

  const colorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translationX.value,
        [0, size],
        [c1, c2]
      ),
    };
  }, []);

  return <AnimatedTrack style={colorStyle} absoluteFill {...rest} />;
};

const Switch = ({
  theme,
  value,
  onChange,
  size = 35,
  roundness,
  gap = 5,
  trackColor = 'input',
  circleColor = '#FFF',
  activeTrackColor = 'primary',
  handleShow,
  renderHandleContent,
  disabled,
  ...rest
}: Props) => {
  const dragRef = React.useRef(null);
  const TRACK_WIDTH = size * 2 - gap;
  const circleSize = size - gap * 2;

  const changeValue = (v: boolean) => {
    if (onChange) onChange(v);
    if (theme.onFeedback) theme.onFeedback('success');
  };

  return (
    <Pressable
      position="relative"
      activeOpacity={0.8}
      height={size}
      borderRadius={isNumber(roundness) ? roundness : size}
      onPress={() => {
        changeValue(!value);
      }}
      webStyle={{
        cursor: 'pointer',
      }}
      {...rest}
      w={TRACK_WIDTH}
      bg={trackColor}
    >
      <Flex height="100%">
        <Draggable
          ref={dragRef}
          direction="x"
          minX={0}
          maxX={circleSize + gap}
          snapFactor={circleSize / 2}
          snapToStart
          snapTo={[{ x: 0 }, { x: circleSize + gap }]}
          initialSnap={{ x: value === true ? circleSize + gap : 0 }}
          snap={{ x: value === true ? circleSize + gap : 0 }}
          onSnap={(index) => {
            changeValue(index === 0 ? false : true);
          }}
          onPress={() => {
            changeValue(!value);
          }}
          wrapperComponent={Track}
          wrapperProps={{
            borderRadius: isNumber(roundness) ? roundness : size,
            size,
            activeTrackColor,
            theme,
            p: gap,
          }}
          activeScale={0.95}
          scaleOnHover
        >
          <Flex
            shadow={handleShow || theme.globals.shadow}
            width={circleSize}
            height={circleSize}
            borderRadius={isNumber(roundness) ? roundness - gap / 2 : size}
            borderWidth={1}
            borderColor={`text:setAlpha:0.05`}
            bg={circleColor}
          >
            {renderHandleContent ? renderHandleContent({ value }) : null}
          </Flex>
        </Draggable>
      </Flex>
    </Pressable>
  );
};

export default withThemeProps(Switch, 'Switch');
