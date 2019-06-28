import React, { Fragment, useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";

import styled from "../../style/styled";

const Page = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background
}));

export default ({
  children,
  hasSafeArea,
  scrollable,
  renderHeader,
  renderFooter,
  scrollViewProps,
  ...rest
}) => {
  const [top, setTop] = useState(0);

  const onScroll = e => {
    const scrollSensitivity = 4 / 3;
    const offset = e.nativeEvent.contentOffset.y / scrollSensitivity;
    setTop(offset);
  };

  const Scroller = scrollable ? ScrollView : Fragment;
  const ScrollerProps = {
    ...{ onScroll, scrollEventThrottle: 100 },
    ...scrollViewProps
  };
  return (
    <Page as={hasSafeArea ? SafeAreaView : undefined} {...rest}>
      {renderHeader ? renderHeader(top) : null}
      <Scroller {...(scrollable ? ScrollerProps : {})}>{children}</Scroller>
      {renderFooter ? renderFooter(top) : null}
    </Page>
  );
};
