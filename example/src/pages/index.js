import * as React from 'react';
import { ThemeProvider, Alert } from 'unikit';

import { styled, Flex, Text, Animate, Page, Button, useTheme } from 'unikit';

import { Header } from '../components';
import { useNavigation } from '../hooks';

const Image = styled.Image({ w: 25, h: 25, resizeMode: 'contain' });
const LinkBox = styled.View({
  w: '90%',
  maxWidth: 700,
  position: 'relative',
  justifyContent: 'space-between',
  alignItems: 'center',
  bg: 'backgroundDark',
  px: 15,
  py: 10,
  mt: 25,
  borderRadius: 5,
  row: true,
  shadow: 5,
});

export default function App() {
  console.log('INNN');
  const { navigate } = useNavigation();
  const theme = useTheme();
  return (
    <ThemeProvider theme={{}}>
      <Page renderHeader={(top) => <Header top={top} />}>
        <Flex w="100vw" h="95vh" flexCenter>
          <Text
            font="h1"
            textAlign="center"
            px="10%"
            dynamicFontSize={{ max: 100, factor: 15 }}
            bold
            delay={500}
            animate
            animateType="word"
          >
            streamline the way you develop apps
          </Text>
          <Animate duration={500} delay={1000}>
            <Text
              font="p"
              dynamicFontSize={{ min: 16, max: 24, factor: 35 }}
              maxWidth={600}
              mt={30}
              px="10%"
              textAlign="center"
            >
              build responsive and accessible mobile-first projects for web and
              native with an easy to use component library.
            </Text>
          </Animate>
          <Animate duration={500} delay={1500} row={{ s: false, m: true }}>
            <Button
              onPress={() => navigate('Components')}
              size={60}
              mt={30}
              shadow={10}
              animateMode="scale"
              mx={10}
              gradient
              rounded
            >
              Components
            </Button>
            <Button
              onPress={() => {
                // theme.alert({
                //   component: 'ActionSheet',
                //   position: 'bottom',
                //   timeout: false,
                //   backdrop: true,
                // });
                theme.alert({
                  type: 'success',
                  message: 'soon ✌️',
                });
                //window.open('https://snack.expo.io/@kations/unikit', '_blank')
              }}
              bg="backgroundDark"
              size={60}
              mt={30}
              shadow={10}
              animateMode="scale"
              mx={10}
              rounded
              renderLeft={
                <Image mr={10} source={require('../../assets/expo.png')} />
              }
            >
              Expo Snack
            </Button>
          </Animate>
        </Flex>

        <Flex bg="primary" w="100vw" h="auto" py="10vh" flexCenter>
          <Text font="h2" textAlign="center" color="#FFF" bold>
            Get started
          </Text>
          <LinkBox>
            <Text font="code" color="#FFF">
              yarn add unikit
            </Text>
            <Button size={34} gradient>
              Copy
            </Button>
          </LinkBox>

          <LinkBox>
            <Text font="code" color="#FFF">
              expo install react-native-svg react-native-reanimated
            </Text>
            <Button size={34} gradient>
              Copy
            </Button>
          </LinkBox>
        </Flex>

        {Array.from({ length: 10 }, (_, index) => index + 1).map((a, i) => (
          <Animate
            key={`${i}-index-shadow`}
            delay={i * 1000}
            duration={i + 1 * 1000}
            bg="surface"
            w={100}
            h={100}
            shadow={i + 1}
            m={20}
            borderRadius={5}
            flexCenter
          >
            <Text bold>{i + 1}</Text>
          </Animate>
        ))}
      </Page>
    </ThemeProvider>
  );
}
