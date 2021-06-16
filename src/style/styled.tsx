import React from 'react';
import {
  View,
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';

import useTheme from './useTheme';
import { matchProps, boxFunctions } from './styledFunctions';
import { generateHash, isFunction } from '../util';

const styleMap: StyleMap = {};

const styled = (Component: React.ComponentType = View) => {
  const styledComponent = (
    styledProps: ViewStyle | ImageStyle | TextStyle = {}
  ) => {
    const ForwardRefComponent = React.forwardRef(
      (
        props: ViewStyle | ImageStyle | TextStyle | React.ReactNode | any[],
        ref
      ) => {
        const theme = useTheme();

        const css = React.useRef(
          matchProps(
            {
              ...(isFunction(styledProps) ? styledProps(props) : styledProps),
              ...props,
            },
            boxFunctions,
            theme
          )
        );

        React.useEffect(() => {
          const cssObj = matchProps(
            {
              ...(isFunction(styledProps) ? styledProps(props) : styledProps),
              ...props,
            },
            boxFunctions,
            theme
          );
          css.current = cssObj;
          const hash = generateHash(cssObj);
          const style = styleMap[hash];
          if (style) {
            style.usages++;
          } else {
            styleMap[hash] = { style: cssObj, usages: 1 };
          }
          // When the style is not used anymore, we destroy it
          return () => {
            const styleClean = styleMap[hash];
            styleClean.usages--;
            if (styleClean.usages <= 0) delete styleMap[hash];
          };
        }, [props, theme]);

        //if (props.as) Component = props.as;
        return (
          <Component
            ref={ref}
            {...props}
            style={[css?.current, StyleSheet.flatten(props.style || {})]}
          />
        );
      }
    );
    return ForwardRefComponent;
  };
  return styledComponent;
};

styled.View = styled(View);
styled.Pressable = styled(Pressable);
styled.Touchable = styled(TouchableOpacity);
styled.Text = styled(Text);
styled.ImageBackground = styled(ImageBackground);
styled.Image = styled(Image);

export default styled;
