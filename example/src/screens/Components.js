import * as React from 'react';

import { Grid, Flex, Text, Animate, Page, Touchable } from 'unikit';

import { Header } from '../components';
import { pages } from '../pages';
import { useNavigation } from '../hooks';
const Playground = React.lazy(() => import('../components/Playground'));

const getComponentsByGroup = (array, group) => {
  return array.filter((item) => item.group === group);
};

export default function App() {
  const { navigate } = useNavigation();
  const groups = ['Layout', 'Interface', 'Inputs'];
  return (
    <Page renderHeader={(top) => <Header title="components" top={top} />}>
      <Flex w="100vw" h={100} />

      <Flex w="100%" px="10vw">
        {groups.map((group) => {
          return (
            <React.Fragment key={group}>
              <Text font="h3" mt={25} bold>
                {group}
              </Text>
              <Grid mt={10} mb={50} min={250} gap={20}>
                {getComponentsByGroup(pages, group)
                  .sort((a, b) => a.title > b.title)
                  .map(({ title, slug, smallCode }) => {
                    return (
                      <Touchable
                        key={slug}
                        onPress={() => navigate('Component', { slug })}
                      >
                        <Animate delay={500} duration={500}>
                          <Flex
                            bg="primary:setAlpha:0.1"
                            w="100%"
                            height={200}
                            overflow="hidden"
                            borderRadius={5}
                            flexCenter
                          >
                            <React.Suspense fallback={<Text>Loading...</Text>}>
                              <Playground
                                code={smallCode}
                                title={title}
                                clean
                              />
                            </React.Suspense>
                          </Flex>
                          <Flex px={7} py={12}>
                            <Text font="h4">{title}</Text>
                          </Flex>
                        </Animate>
                      </Touchable>
                    );
                  })}
              </Grid>
            </React.Fragment>
          );
        })}
      </Flex>
    </Page>
  );
}
