import React from 'react';
import Tabs from '../Tabs';

function Comp({ onChange, options, size, ...rest }) {
  return (
    <Tabs
      options={options}
      bg="input"
      size={size * 0.9}
      indicatorSize="100%"
      inactiveColor="text"
      onChange={onChange}
      {...rest}
    />
  );
}

export default Comp;
