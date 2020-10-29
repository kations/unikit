import { View, Text, TouchableOpacity, Image } from 'react-native';
import { default as SCstyled } from 'styled-components/native';

import { matchProps, boxFunctions } from './styledFunctions';

const styled = (BaseComponent: React.ComponentType<any> = View) => (
  BaseStyle
) => {
  return SCstyled(BaseComponent)((p) => matchProps(p, boxFunctions, BaseStyle));
};

styled['Text'] = styled(Text);
styled['Box'] = styled(View);
styled['View'] = styled(View);
styled['Touchable'] = styled(TouchableOpacity);
styled['Image'] = styled(Image);

export default styled;
