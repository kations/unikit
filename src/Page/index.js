import React, { Fragment, useState, useRef, useEffect } from "react";
import { ScrollView, SafeAreaView, Platform } from "react-native";

import styled, { withThemeProps } from "../styled";

const PageWrap = styled.View({
  flex: 1,
  web: {
    transitionProperty: "all",
    transitionDuration: "250ms"
  }
});

export function Page({
  bg = "background",
  children,
  hasSafeArea,
  scrollable,
  renderHeader,
  renderFooter,
  scrollViewProps,
  scrollViewComponent,
  onScroll,
  scrollTop,
  scrollAnimated = true,
  ...rest
}) {
  const [top, setTop] = useState(0);
  const scrollRef = useRef(null);

  const onScrollPage = e => {
    const scrollSensitivity = 4 / 3;
    const offset = e.nativeEvent.contentOffset.y / scrollSensitivity;
    if (onScroll) onScroll(e.nativeEvent.contentOffset);
    setTop(offset);
  };

  useEffect(() => {
    if (scrollRef && scrollRef.current && scrollRef.current.scrollTo) {
      scrollRef.current.scrollTo({
        x: scrollTop,
        y: 0,
        animated: scrollAnimated
      });
    }
  }, [scrollTop]);

  const Scroller = scrollable ? scrollViewComponent || ScrollView : Fragment;
  const ScrollerProps = {
    ...{
      onScroll: onScrollPage,
      scrollEventThrottle: 100,
      showsVerticalScrollIndicator: false,
      ref: scrollRef
    },
    ...scrollViewProps
  };
  return (
    <PageWrap
      bg={bg}
      as={hasSafeArea ? SafeAreaView : undefined}
      accessibilityRole={Platform.OS === "web" ? "main" : "none"}
      {...rest}
    >
      {renderHeader ? renderHeader(top) : null}
      <Scroller {...(scrollable ? ScrollerProps : {})}>
        {children instanceof Function ? children(ScrollerProps) : children}
      </Scroller>
      {renderFooter ? renderFooter(top) : null}
    </PageWrap>
  );
}

export default withThemeProps(Page, "Page");
