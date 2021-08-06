import * as React from 'react';
import { Button, Flex, Text, Animate, Page, Icon } from 'unikit';
import { Header } from '../components';
import { pages } from '../pages';
import { useNavigation } from '../hooks';

const Playground = React.lazy(() => import('../components/Playground'));
const PropTable = React.lazy(() => import('../components/PropTable'));

export default function App({ route = {} }) {
  const { navigate } = useNavigation();
  const { slug } = route.params || {};
  const item = pages.find((p) => p.slug === slug);
  const { title, desc, from, code, props, smallCode, codeProps } = item;

  return (
    <Page
      title={slug}
      leftAction={
        <Button
          size={44}
          onPress={() => navigate('Components')}
          bg="accent"
          rounded
        >
          <Icon name="chevron-left" />
        </Button>
      }
    >
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

      <Flex w="100%" px="10vw">
        <React.Suspense fallback={<Text>Loading...</Text>}>
          <Playground
            key={title}
            code={code || smallCode}
            title={from}
            codeProps={codeProps}
          />
        </React.Suspense>
      </Flex>
      <Flex w="100%" px="10vw" mt={50}>
        <Text
          font="h3"
          textAlign="center"
          px="10%"
          dynamicFontSize={{ max: 40, factor: 10 }}
          bold
          delay={500}
          animate
          animateType="word"
        >
          Props
        </Text>
        <React.Suspense fallback={<Text>Loading...</Text>}>
          <PropTable
            key={title}
            code={code || smallCode}
            title={from}
            codeProps={codeProps}
          />
        </React.Suspense>
      </Flex>
      <Flex w="100%" h={1000} />
    </Page>
  );
}
