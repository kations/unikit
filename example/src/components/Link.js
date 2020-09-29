import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Touchable } from 'unikit';

const NativeLink = ({ to, params = {}, children }) => {
  const { navigate } = useNavigation();
  return <Touchable onPress={() => navigate(to, params)}>{children}</Touchable>;
};

export default NativeLink;
