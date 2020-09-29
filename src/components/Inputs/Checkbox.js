import React, { useState, useEffect } from 'react';

import { withThemeProps } from '../../restyle';

import Touchable from '../Touchable';
import Animate from '../Animate';

const Checkbox = ({
  theme,
  color = 'primary',
  value,
  onChange,
  size = 26,
  borderSize = 2,
  disabled,
  ...rest
}) => {
  const [active, setActive] = useState(value || false);

  useEffect(() => {
    if (value !== active) setActive(value);
  }, [value]);

  const onPressSwitch = (newActive) => {
    if (disabled) return false;
    setActive(newActive);
    setTimeout(() => {
      if (onChange) onChange(newActive);
    }, 10);
    if (theme.onFeedback) theme.onFeedback('success');
  };

  return (
    <Touchable
      width={size}
      height={size}
      activeOpacity={0.8}
      size={size}
      borderWidth={borderSize}
      borderColor={color}
      borderRadius={size / 2}
      flexCenter
      onPress={() => {
        onPressSwitch(!active);
      }}
      {...rest}
    >
      <Animate
        from={{ s: 0 }}
        to={{ s: 1 }}
        bg={color}
        width={size - borderSize * 5}
        height={size - borderSize * 5}
        borderRadius={size / 2}
        isVisible={active === true}
      />
    </Touchable>
  );
};

export default withThemeProps(Checkbox, '');
