import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import { matchProps, textFunctions } from './styledFunctions';

const styledText = (BaseComponent: React.ComponentType<any> = Text) => (
  BaseStyle
) => {
  return styled(BaseComponent)((p) => matchProps(p, textFunctions, BaseStyle));
};

export default styledText;
