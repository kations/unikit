import * as React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { withThemeProps, Touchable } from "../../style";
import Animate from "../Animate";
import Gradient from "../Gradient";
import Text from "../Text";
import Flex from "../Flex";
import Icon from "../Icon";

function TabBar({
  theme,
  index,
  state,
  descriptors,
  navigation,
  routes,
  size = 64,
  bg = "background:setAlpha:0.95",
  hideLabel = true,
  focusColor = "primary",
  blurColor = "primary:setAlpha:0.4",
  countColor = "primary:darken:5",
  offset = 10,
  roundness = 35,
  noInset = true,
  backgroundGradient = true,
  animateProps = {},
  ...rest
}) {
  const insets = useSafeAreaInsets();
  if (!routes) routes = state?.routes || [];
  if (!index) index = state?.index || 0;
  return (
    <>
      {backgroundGradient ? (
        <Gradient
          h={200}
          l={0}
          r={0}
          b={0}
          colors={["background", "rgba(0,0,0,0)"]}
          deg={0}
          absolute
          pointerEvents="none"
        />
      ) : null}
      <Animate
        l={offset}
        r={offset}
        b={offset ? insets.bottom * 0.75 : offset}
        absolute
        {...animateProps}
      >
        <Flex
          bg={bg}
          w="100%"
          pb={offset >= 10 ? 0 : insets.bottom / 2}
          px={roundness / 3}
          shadow={5}
          borderRadius={roundness}
          {...rest}
        >
          <Flex justifyContent="space-around" row>
            {routes.map((route, i) => {
              const options = descriptors
                ? descriptors?.[route.key]?.options || {}
                : route;
              const label =
                options?.tabBarLabel || options?.title || route?.name;
              const isFocused = index === i;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  // The `merge: true` option makes sure that the params inside the tab screen are preserved
                  navigation.navigate({ name: route.name, merge: true });
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (
                <Touchable
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options?.tabBarTestID}
                  onPress={options.onPress || onPress}
                  onLongPress={onLongPress}
                  flex={1}
                  h={size}
                  center
                  relative
                  key={`navbar-tab-${label || ""}-${i}`}
                >
                  {options.icon ? (
                    <Flex relative>
                      <Icon
                        name={options.icon}
                        size={options.iconSize || 28}
                        color={isFocused ? focusColor : blurColor}
                        animate={isFocused}
                        animateFillPath={blurColor}
                        duration={400}
                        strokeWidth={isFocused ? 1.5 : 1}
                      />
                      {options.count ? (
                        <Flex
                          absolute
                          t={-5}
                          l={12}
                          px={8}
                          py={3}
                          borderRadius={20}
                          bg={countColor}
                        >
                          <Text font="caption" color="#FFF">
                            {options.count}
                          </Text>
                        </Flex>
                      ) : null}
                    </Flex>
                  ) : null}
                  {hideLabel !== true ? (
                    <Text
                      font="label"
                      mt={5}
                      color={isFocused ? focusColor : blurColor}
                    >
                      {label}
                    </Text>
                  ) : null}
                </Touchable>
              );
            })}
          </Flex>
        </Flex>
      </Animate>
    </>
  );
}

export default withThemeProps(TabBar, "TabBar");
