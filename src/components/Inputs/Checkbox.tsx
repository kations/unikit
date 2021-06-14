import React, { useState, useEffect } from 'react';

import { withThemeProps, Pressable } from '../../style';

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
    <Pressable
      width={size}
      height={size}
      borderWidth={borderSize}
      borderColor={color}
      borderRadius={size / 2}
      center
      onPress={() => {
        onPressSwitch(!active);
      }}
      {...rest}
    >
      <Animate
        from={{ scale: 0 }}
        to={{ scale: 1 }}
        bg={color}
        width={size - borderSize * 5}
        height={size - borderSize * 5}
        borderRadius={size / 2}
        visible={active === true}
      />
    </Pressable>
  );
};

export default withThemeProps(Checkbox, 'Checkbox');
