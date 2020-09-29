// import * as React from 'react';
// import { styled, system, withThemeProps } from '../../theme';
// import {TouchableOpacity} from "react-native"

// const Comp = styled.TouchableOpacity`
//   ${system}
// `;

// const Touchable = (props) => <Comp activeOpacity={0.8} {...props} />;

// export default withThemeProps(Touchable, 'Touchable');
import { TouchableOpacity } from 'react-native';

import { createBox } from '../../restyle';

export default createBox(TouchableOpacity);
