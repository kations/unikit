import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { matchProps, boxFunctions } from './styledFunctions';

const createBox = (BaseComponent: React.ComponentType<any> = View) => {
  return styled(BaseComponent)((p) => matchProps(p, boxFunctions));
};

export default createBox;
