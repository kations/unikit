import * as React from 'react';

import { ScrollView } from 'react-native';
import { ThemeProvider, Flex, Text, Animate } from 'unikit';

//const Box = styled.View((p) => ({ borderRadius: 25 + p.i, ml: p.i }));

export default function App() {
  return (
    <ThemeProvider>
      <ScrollView>
        <Flex bg="primary" w="100vw" h="80vh" flexCenter>
          <Text
            font="h1"
            textAlign="center"
            px="10%"
            dynamicFontSize={{ max: 100, factor: 15 }}
            bold
            animate
            animateType="word"
          >
            streamline the way you develop apps
          </Text>
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
        {/* {Array.from({ length: 150 }, (_, index) => index + 1).map((a, i) => (
          <Box
            key={`${i}-index`}
            bg={`primary:setAlpha:${1 - i * 0.01}`}
            w={{ s: 100 + i, m: 200 + i }}
            h={{ s: 100, m: 200 }}
            i={i}
            as={Text}
          >
            <Text>{i}</Text>
          </Box>
        ))} */}
      </ScrollView>
    </ThemeProvider>
  );
}
