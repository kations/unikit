import * as React from "react";
import { ScrollView, SafeAreaView, Platform } from "react-native";

import Flex from "../Flex";
import { withThemeProps } from "../../restyle";

interface Props {
  children: React.ReactNode;
  onPress: void;
  theme: object;
  rounded?: boolean;
  light?: boolean;
  outlined?: boolean;
  [key: string]: any;
}

const Page = ({
  bg = "background",
  children,
  hasSafeArea,
  scrollable = true,
  renderHeader,
  renderFooter,
  scrollViewProps,
  scrollViewComponent,
  onScroll,
  scrollTop,
  scrollAnimated = true,
  ...rest
}: Props) => {
  const [top, setTop] = React.useState(0);
  const scrollRef = React.useRef(null);

  const onScrollPage = (e) => {
    const scrollSensitivity = 4 / 3;
    const offset = e.nativeEvent.contentOffset.y / scrollSensitivity;
    if (onScroll) onScroll(e.nativeEvent.contentOffset);
    setTop(offset);
  };

  React.useEffect(() => {
    if (scrollRef && scrollRef.current && scrollRef.current.scrollTo) {
      scrollRef.current.scrollTo({
        x: scrollTop,
        y: 0,
        animated: scrollAnimated,
      });
    }
  }, [scrollTop]);

  const Scroller = scrollable
    ? scrollViewComponent || ScrollView
    : React.Fragment;
  const ScrollerProps = {
    ...{
      onScroll: onScrollPage,
      scrollEventThrottle: 100,
      showsVerticalScrollIndicator: false,
      ref: scrollRef,
    },
    ...scrollViewProps,
  };
  return (
    <Flex
      flex={1}
      bg={bg}
      as={hasSafeArea ? SafeAreaView : undefined}
      accessibilityRole={Platform.OS === "web" ? "main" : "none"}
      webStyle={{ transitionDuration: "0.5s", transitionProperty: "all" }}
      {...rest}
    >
      {renderHeader ? renderHeader(top) : null}
      <Scroller {...(scrollable ? ScrollerProps : {})}>
        {children instanceof Function ? children(ScrollerProps) : children}
      </Scroller>
      {renderFooter ? renderFooter(top) : null}
    </Flex>
  );
};

export default withThemeProps(Page, "Page");
