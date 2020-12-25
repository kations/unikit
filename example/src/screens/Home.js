import * as React from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  Flex,
  Animate,
  Page,
  Icon,
  Button,
  isAndroid,
  H1,
  H3,
  H5,
  P,
  Grid,
  withTheme,
} from 'unikit';
import { Wrapper, Link, Navbar } from 'components';
import { pages } from '../pages';
const Playground = React.lazy(() => import('../components/Playground'));

const getComponentsByGroup = (array, group) => {
  return array.filter((item) => item.group === group);
};

export default withTheme(function App() {
  const groups = ['UI', 'Inputs', 'Primitives'];

  return (
    <Page
      renderHeader={(top) => {
        return (
          <Navbar
            title="Unikit"
            top={top}
            leftAction={
              <Button size={40} rounded light>
                <Icon name="github" size={20} animate />
              </Button>
            }
          />
        );
      }}
      scrollViewProps={{ scrollEventThrottle: 16 }}
    >
      <Wrapper pt={200} pb={150} flexCenter>
        <H1 bold animate>
          Universal
        </H1>
        <H1 mt={-10} bold animate delay={250}>
          Components
        </H1>
        <P
          mt={30}
          maxWidth={400}
          textAlign="center"
          animate
          animateType="word"
          delay={500}
        >
          build responsive and accessible mobile-first projects for web and
          native with an easy to use component library.
        </P>
      </Wrapper>
      <Wrapper my={30}>
        <H3>Getting started</H3>
        <Animate delay={250} mt={15}>
          <Flex bg="primary:setAlpha:0.1" p={30}>
            <P>
              <P color="primary">{`yarn add`}</P>
              {` unikit styled-components react-native-svg react-native-reanimated`}
            </P>
          </Flex>
        </Animate>
      </Wrapper>
      <Wrapper>
        {groups.map((group) => {
          return (
            <React.Fragment key={group}>
              <H3 mt={25}>{group}</H3>
              <Grid mt={10} mb={50} min={200} gap={20}>
                {getComponentsByGroup(pages, group)
                  .sort((a, b) => a.title > b.title)
                  .map(({ title, slug, smallCode }) => {
                    return (
                      <Link to="Template" params={{ slug }} key={slug}>
                        <Animate delay={500}>
                          <Flex
                            bg="primary:setAlpha:0.1"
                            w="100%"
                            height={150}
                            overflow="hidden"
                            flexCenter
                          >
                            <React.Suspense fallback={<P>Loading...</P>}>
                              <Playground
                                code={smallCode}
                                title={title}
                                clean
                              />
                            </React.Suspense>
                          </Flex>
                          <Flex px={20} py={12}>
                            <H5 my={5}>{title}</H5>
                          </Flex>
                        </Animate>
                      </Link>
                    );
                  })}
              </Grid>
            </React.Fragment>
          );
        })}
      </Wrapper>
    </Page>
  );
});
