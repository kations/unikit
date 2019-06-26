import React, { useEffect, useRef } from "react";
import { withTheme, useTheme } from "./Theme";
import * as reactNative from "react-native";

const aliases = `ActivityIndicator ActivityIndicatorIOS Button DatePickerIOS DrawerLayoutAndroid
 Image ImageBackground ImageEditor ImageStore KeyboardAvoidingView ListView MapView Modal NavigatorIOS
 Picker PickerIOS ProgressBarAndroid ProgressViewIOS ScrollView SegmentedControlIOS Slider
 SliderIOS SnapshotViewIOS Switch RecyclerViewBackedScrollView RefreshControl SafeAreaView StatusBar
 SwipeableListView SwitchAndroid SwitchIOS TabBarIOS Text TextInput ToastAndroid ToolbarAndroid
 Touchable TouchableHighlight TouchableNativeFeedback TouchableOpacity TouchableWithoutFeedback
 View ViewPagerAndroid WebView FlatList SectionList VirtualizedList`;

const colorStyles = ["color", "backgroundColor", "borderColor"];

const getThemeStyle = (style, theme) => {
  const themeStyle = { ...style };
  colorStyles.map(key => {
    if (style[key]) {
      themeStyle[key] = theme.colors[style[key]] || style[key];
    }
  });
  if (style["fontSize"] && theme.fontSize[style["fontSize"]]) {
    themeStyle["fontSize"] = theme.fontSize[style["fontSize"]];
  }
  return themeStyle;
};

const styled = Component => {
  const comp = arg => {
    return withTheme(props => {
      const { style, children, theme, as, ...rest } = props;

      const RenderComp = as ? as : Component;

      if (typeof arg === "function") {
        var styles = arg({ theme, ...rest });
      } else {
        var styles = arg;
      }
      let composed = [];
      if (styles) {
        const themeStyle = getThemeStyle(styles, theme);
        composed = [
          ...composed,
          reactNative.StyleSheet.create({
            themeStyle
          }).themeStyle
        ];
        //console.log({ themeStyle, composed, styles, rest });
      }

      if (Array.isArray(style)) {
        composed = [...composed, ...style];
      } else if (style) {
        const themeStyle = getThemeStyle(style, theme);
        //console.log({ themeStyle, style });
        composed = [
          ...composed,
          reactNative.StyleSheet.create({
            themeStyle
          }).themeStyle
        ];
      }

      //console.log(RenderComp.displayName, styles);
      // if (
      //   !RenderComp.displayName ||
      //   (RenderComp.displayName &&
      //     RenderComp.displayName.indexOf("styled") === -1)
      // ) {
      //   RenderComp.displayName = `styled(${getDisplayName(RenderComp)})`;
      // }

      //console.log(RenderComp.displayName, "in");

      return (
        <RenderComp style={composed} {...rest}>
          {children}
        </RenderComp>
      );
    });
  };

  return arg => {
    // if (typeof arg === "function") {
    //   console.log({ arg: arg({ cancelColor: "#000" }) });
    //   return withTheme(comp(arg({ cancelColor: "#000" })));
    // }
    // console.log({ arg });
    return comp(arg);
  };
};

const getDisplayName = primitive =>
  typeof primitive === "string"
    ? primitive
    : primitive.displayName || primitive.name || "Styled";

aliases.split(/\s+/m).forEach(alias =>
  Object.defineProperty(styled, alias, {
    enumerable: true,
    configurable: false,
    get() {
      return styled(reactNative[alias]);
    }
  })
);

export default styled;
