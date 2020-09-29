import React, { useState, useEffect } from "react";
import Tabs from "../Tabs";
function Comp({ onChange, options, ...rest }) {
  return (
    <Tabs
      options={options}
      bg="input"
      tabSize={45}
      tabProps={{ bg: "transparent", font: "p" }}
      indicatorSize="100%"
      activeColor="#FFF"
      borderRadius={7}
      onChange={onChange}
      {...rest}
    />
  );
}

export default Comp;
