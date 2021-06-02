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
  const { title, desc, from, code, smallCode, codeProps } = item;
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
        {desc ? (
          <Animate duration={500} delay={1000}>
            <Text
              font="p"
              dynamicFontSize={{ min: 16, max: 22, factor: 35 }}
              maxWidth={600}
              mt={30}
              px="10%"
              textAlign="center"
            >
              {desc}
            </Text>
          </Animate>
        ) : null}
      </Flex>

      <Flex w="100%" px="10vw" h={800}>
        <React.Suspense fallback={<Text>Loading...</Text>}>
          <Playground
            key={title}
            code={code || smallCode}
            title={from}
            codeProps={codeProps}
          />
        </React.Suspense>
      </Flex>
    </Page>
  );
}
