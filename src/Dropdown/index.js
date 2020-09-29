import React, { Children, useState, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { TouchableOpacity, Platform, Dimensions } from 'react-native';

import styled, { withThemeProps } from '../styled';
import Flex from '../Flex';
import Animate from '../Animate';
import Overlay from '../Overlay';
import { useUpdateEffect } from '../hooks';

const BackdropPress = styled.TouchableOpacity(({ zIndex, theme }) => ({
  position: Platform.OS === 'web' ? 'fixed' : 'absolute',
  left: 0,
  bottom: 0,
  top: 0,
  right: 0,
}));

const POSITIONS = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const Dropdown = withThemeProps(
  ({
    children,
    position = 'center',
    animateProps = { t: '100%', l: 0, r: 0 },
    contentProps = {},
    content = null,
    theme,
    backdrop = true,
    backdropOpacity = 0.1,
    isOpen = false,
    ...rest
  }) => {
    const [open, setOpen] = useState(isOpen);
    const { width, height } = Dimensions.get('window');

    useUpdateEffect(() => {
      setOpen(isOpen);
    }, [isOpen]);

    return (
      <Fragment>
        {backdrop && Platform.OS !== 'web' ? (
          <Animate
            isVisible={open}
            from={{ o: 0 }}
            to={{ o: backdropOpacity }}
            zIndex={0}
            absolute
            t={-(height / 2)}
            r={-(width / 2)}
            w={width * 2}
            h={height * 2}
            bg="#000"
          >
            <BackdropPress
              onPress={() => setOpen(false)}
              activeOpacity={1}
              absoluteFill
            />
          </Animate>
        ) : null}
        <Flex relative>
          {Children.only(
            React.cloneElement(children, {
              as: TouchableOpacity,
              onPress: () => {
                setOpen(!open);
              },
              ...rest,
            })
          )}
          {Platform.OS === 'android' ? (
            open ? (
              <Overlay
                contentProps={{ bg: 'surface', maxWidth: 500, width: '90%' }}
                visible={open}
                onClose={() => setOpen(false)}
              >
                {content}
              </Overlay>
            ) : null
          ) : (
            <Animate
              w="100%"
              from={{ o: 0, y: 20 }}
              to={{ o: 1, y: 0 }}
              isVisible={open}
              useTransition
              absolute
              pointerEvents={open ? 'auto' : 'none'}
              alignItems={POSITIONS[position]}
              {...animateProps}
            >
              <Flex
                w="100%"
                shadow={50}
                borderWidth={1}
                borderColor="text"
                bg="surface"
                borderColorAlpha={0.05}
                p={10}
                borderRadius={theme.globals.roundness}
                row
                {...contentProps}
              >
                {content instanceof Function
                  ? content({ close: () => setOpen(false) })
                  : content}
              </Flex>
            </Animate>
          )}
        </Flex>
      </Fragment>
    );
  },
  'Dropdown'
);

Dropdown.propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  animateProps: PropTypes.object,
};

Dropdown.defaultPropTypes = {};

export default Dropdown;
