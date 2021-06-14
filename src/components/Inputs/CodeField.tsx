import * as React from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { styled, withThemeProps } from '../../style';
import { useFocusState } from '../../hooks';
import Flex from '../Flex';
import Text from '../Text';
import Animate from '../Animate';

const TextInput = styled(RNTextInput)();

function CodeField({
  theme,
  value = '',
  onChange,
  size = 55,
  font = 'h5',
  autoFocus = false,
  secureTextEntry = false,
  clean = false,
  cells = 6,
  keyboardType = 'number-pad',
  gap = 10,
  customCursor,
  onFulFill,
  cellProps = {},
  labelProps = {},
  ...rest
}) {
  const ref = React.useRef(null);
  const { isFocused, onBlur, onFocus } = useFocusState({ autoFocus });

  React.useEffect(() => {
    if (value && value.length === cells) {
      const { current: inputInstance } = ref;

      if (inputInstance) {
        inputInstance.blur();
        if (onFulFill) onFulFill();
      }
    }
  }, [value]);

  return (
    <Flex width="100%" relative {...rest}>
      <Flex
        width="100%"
        justifyContent="space-between"
        pointerEvents="none"
        row
      >
        {Array.from(Array(cells).keys()).map((i) => {
          const active = i === value.length && isFocused;
          const content = value ? value.split('')[i] : '';
          return (
            <Flex
              key={`cell-${i}`}
              bg={clean ? 'transparent' : 'input'}
              flex={1}
              mr={i === cells - 1 ? 0 : gap}
              h={size}
              flexCenter
              borderRadius={theme.globals.roundness}
              shadow={clean ? undefined : theme.globals.shadow}
              borderWidth={clean ? undefined : 2}
              borderColor={active ? 'primary' : 'input'}
              {...cellProps}
            >
              {content && !secureTextEntry ? (
                <Text {...labelProps}>{content}</Text>
              ) : null}
              {content && secureTextEntry ? (
                <Flex flexCenter relative>
                  <Animate
                    delay={200}
                    from={{ opacity: 1, scale: 1 }}
                    to={{ opacity: 0, scale: 0 }}
                  >
                    <Text font={font} {...labelProps}>
                      {content}
                    </Text>
                  </Animate>
                  <Flex flexCenter absoluteFill>
                    <Animate
                      w={10}
                      h={10}
                      borderRadius={10}
                      delay={500}
                      duration={500}
                      bg="text"
                      from={{ opacity: 0, scale: 1.7 }}
                      to={{ opacity: 1, scale: 1 }}
                    />
                  </Flex>
                </Flex>
              ) : null}
              {active ? (
                <Animate
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  duration={750}
                  repeat={-1}
                >
                  {customCursor || <Flex w={2} h={size * 0.6} bg="text" />}
                </Animate>
              ) : null}
            </Flex>
          );
        })}
      </Flex>
      <TextInput
        ref={ref}
        disableFullscreenUI
        caretHidden={true}
        spellCheck={false}
        autoCorrect={false}
        blurOnSubmit={false}
        clearButtonMode="never"
        autoCapitalize="characters"
        underlineColorAndroid="transparent"
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        maxLength={cells}
        value={value}
        onChangeText={(t) => onChange(t.replace(/[^0-9]+/g, ''))}
        h={size}
        mt={-size}
        webStyle={{ outlineStyle: 'none', borderColor: 'transparent' }}
        onBlur={onBlur}
        onFocus={onFocus}
        opacity={0.01}
      />
    </Flex>
  );
}

export default withThemeProps(CodeField, 'CodeField');
