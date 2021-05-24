import * as React from 'react';

import { Grid, Flex, Text, Animate, Page, Touchable } from 'unikit';

import { Header } from '../components';
import { pages } from '../pages';
import { useNavigation } from '../hooks';

const Playground = React.lazy(() => import('../components/Playground'));

export default function App({ route = {} }) {
  const { navigate } = useNavigation();
  const { slug } = route.params || {};
  const item = pages.find((p) => p.slug === slug);
  const { title, from, code, smallCode } = item;
  return (
    <Page renderHeader={(top) => <Header title={slug} top={top} />}>
      <Flex w="100vw" h="40vh" mt={80} flexCenter>
        <Text
          font="h1"
          textAlign="center"
          px="10%"
          dynamicFontSize={{ max: 70, factor: 10 }}
          bold
          delay={500}
          animate
          animateType="word"
        >
          {title}
        </Text>
      </Flex>

      <Flex w="100%" px="10vw" h={800}>
        <React.Suspense fallback={<Text>Loading...</Text>}>
          <Playground code={code || smallCode} title={from} />
        </React.Suspense>
      </Flex>
    </Page>
  );
}
