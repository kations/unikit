import React, { Fragment, useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";

import styled from "../styled";
import Box from "../Box";

const Page = styled(Box)({});

export default ({
  type = "background",
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
    ...{ onScroll: onScrollPage, scrollEventThrottle: 100 },
    ...scrollViewProps
  };
  return (
    <Page type={type} as={hasSafeArea ? SafeAreaView : undefined} {...rest}>
      {renderHeader ? renderHeader(top) : null}
      <Scroller {...(scrollable ? ScrollerProps : {})}>{children}</Scroller>
      {renderFooter ? renderFooter(top) : null}
    </Page>
  );
};
