import React, { Fragment, useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";

import styled from "../styled";

const Page = styled.View({
  flex: 1
});

export default ({
  bg = "background",
  children,
  hasSafeArea,
  scrollable,
  renderHeader,
  renderFooter,
  scrollViewProps,
  onScroll,
  ...rest
}) => {
  const [top, setTop] = useState(0);

  const onScrollPage = e => {
    const scrollSensitivity = 4 / 3;
    const offset = e.nativeEvent.contentOffset.y / scrollSensitivity;
    if (onScroll) onScroll(e.nativeEvent.contentOffset);
    setTop(offset);
  };

  const Scroller = scrollable ? ScrollView : Fragment;
  const ScrollerProps = {
    ...{
      onScroll: onScrollPage,
      scrollEventThrottle: 100,
      showsVerticalScrollIndicator: false
    },
    ...scrollViewProps
  };
  return (
    <Page
      bg={bg}
      as={hasSafeArea ? SafeAreaView : undefined}
      accessibilityRole="main"
      {...rest}
    >
      {renderHeader ? renderHeader(top) : null}
      <Scroller {...(scrollable ? ScrollerProps : {})}>{children}</Scroller>
      {renderFooter ? renderFooter(top) : null}
    </Page>
  );
};
