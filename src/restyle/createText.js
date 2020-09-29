import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import { matchProps, textFunctions } from './styledFunctions';

const createBox = (BaseComponent: React.ComponentType<any> = Text) => {
  return styled(BaseComponent)((p) => matchProps(p, textFunctions));
};

export default createBox;
