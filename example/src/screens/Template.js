import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Flex, Page, isWeb, H1, P, Code, Animate } from 'unikit';
import { Wrapper, Header } from '../components';
const Playground = React.lazy(() => import('../components/Playground'));
import { pages } from '../pages';

export default function App({ route = {} }) {
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
      {isWeb && <Header />}
      <Page scrollViewComponent={KeyboardAwareScrollView}>
        <Wrapper mt={50} py={50} flexCenter>
          <H1 bold animate>
            {title}
          </H1>
        </Wrapper>
        <Wrapper>
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
