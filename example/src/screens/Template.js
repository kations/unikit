import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Flex, Page, isWeb, H1, P, Code, Animate } from 'unikit';
import { Wrapper, Header, Navbar } from '../components';
const Playground = React.lazy(() => import('../components/Playground'));
import { pages } from '../pages';

export default function App({ route = {}, navigation: { goBack } }) {
  const { slug } = route.params || {};
  const item = pages.find((p) => p.slug === slug);

  if (!item) return null;
  const { title, from, code, smallCode } = item;

  // return (
  //   <React.Suspense fallback={<P>Loading...</P>}>
  //     <Playground code={code || smallCode} title={from} />
  //   </React.Suspense>
  // );

  return (
    <>
      <Page
        renderHeader={(top) => {
          return (
            <Navbar
              top={top}
              title={title}
              goBack={goBack}
              rightAction={isWeb ? true : false}
            />
          );
        }}
        scrollViewProps={{ scrollEventThrottle: 16 }}
        scrollViewComponent={KeyboardAwareScrollView}
      >
        <Wrapper mt={150}>
          <Animate delay={250}>
            <Flex bg="primary:setAlpha:0.1" p={30}>
              <P>
                <P color="primary">{`import`}</P>
                {` { ${from} } from`}
                <P color="primary">{` 'unikit'`}</P>
              </P>
            </Flex>
          </Animate>
          <Animate delay={250} mt={30}>
            <React.Suspense fallback={<P>Loading...</P>}>
              <Playground code={code || smallCode} title={from} />
            </React.Suspense>
          </Animate>
        </Wrapper>
        <Flex w="100%" h={300} />
      </Page>
    </>
  );
}
