import * as React from 'react';
import { TouchableOpacity, Platform, Dimensions } from 'react-native';

import { withThemeProps } from '../../restyle';
import { useUpdateEffect } from '../../hooks';
import { isAndroid } from '../../utils';
import Flex from '../Flex';
import Animate from '../AnimateNative';
import Touchable from '../Touchable';
import Overlay from '../Overlay';

const POSITIONS = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const Dropdown = ({
  children,
  position = 'center',
  animateProps = { top: '100%', left: 0, right: 0 },
  contentProps = {},
  content = null,
  theme,
  backdrop = true,
  backdropOpacity = 0.1,
  isOpen = false,
  ...rest
}) => {
  const [open, setOpen] = React.useState(isOpen);

  useUpdateEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  if (isAndroid) {
    return (
      <>
        {React.Children.only(
          React.cloneElement(children, {
            as: TouchableOpacity,
            onPress: () => {
              setOpen(!open);
            },
            ...rest,
          })
        )}
        <Overlay
          visible={open}
          onClose={() => setOpen(false)}
          contentProps={contentProps}
        >
          {content instanceof Function
            ? content({ close: () => setOpen(false) })
            : content}
        </Overlay>
      </>
    );
  }

  return (
    <>
      {backdrop && Platform.OS !== 'web' ? (
        <Animate
          isVisible={open}
          from={{ o: 0 }}
          to={{ o: backdropOpacity }}
          zIndex={0}
          absolute
          t={-(theme.height / 2)}
          r={-(theme.width / 2)}
          width={theme.width * 3}
          height={theme.height * 3}
          bg="#000"
        >
          <Touchable
            position={Platform.OS === 'web' ? 'fixed' : 'absolute'}
            onPress={() => setOpen(false)}
            activeOpacity={1}
            left={0}
            top={0}
            right={0}
            bottom={0}
          />
        </Animate>
      ) : null}
      <Flex relative pointerEvents="box-none">
        {React.Children.only(
          React.cloneElement(children, {
            as: TouchableOpacity,
            onPress: () => {
              setOpen(!open);
            },
            ...rest,
          })
        )}

        <Animate
          flex={1}
          from={{ o: 0, y: 20 }}
          to={{ o: 1, y: 0 }}
          isVisible={open}
          useTransition
          position="absolute"
          left={0}
          right={0}
          pointerEvents={open ? 'auto' : 'none'}
          alignItems={POSITIONS[position]}
          {...animateProps}
        >
          <Flex width={theme.width} alignItems={POSITIONS[position]}>
            <Flex
              w="auto"
              shadow={5}
              borderWidth={1}
              borderColor="text:setAlpha:0.05"
              bg="surface"
              p={10}
              borderRadius={theme.globals.roundness}
              {...contentProps}
            >
              {content instanceof Function
                ? content({ close: () => setOpen(false) })
                : content}
            </Flex>
          </Flex>
        </Animate>
      </Flex>
    </>
  );
};

export default withThemeProps(Dropdown, 'Dropdown');
