import * as React from 'react';
import { ScrollView, SafeAreaView, Platform } from 'react-native';

import Flex from '../Flex';
import { withThemeProps } from '../../style';

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
  bg = 'background',
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
  const onScrollPage = React.useCallback((e) => {
    const scrollSensitivity = 4 / 3;
    const offset = e.nativeEvent.contentOffset.y / scrollSensitivity;
    if (onScroll) onScroll(e.nativeEvent.contentOffset);
    setTop(offset);
  }, []);

  const Scroller = scrollable
    ? scrollViewComponent || ScrollView
    : React.Fragment;
  const ScrollerProps = React.useMemo(() => {
    return {
      style: { flex: 1 },
      onScroll: onScrollPage,
      scrollEventThrottle: 100,
      showsVerticalScrollIndicator: false,
      ...scrollViewProps,
    };
  }, []);
  return (
    <Flex
      flex={1}
      h="100vh"
      bg={bg}
      as={hasSafeArea ? SafeAreaView : undefined}
      accessibilityRole={Platform.OS === 'web' ? 'main' : 'none'}
      webStyle={{ transitionDuration: '0.5s', transitionProperty: 'all' }}
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

export default withThemeProps(Page, 'Page');
