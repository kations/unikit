import React, { Fragment, useState, useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { LiveProvider, withLive } from 'react-live';
import * as unikit from 'unikit';
import { Flex, useTheme } from 'unikit';

// import prettier from "@miksu/prettier/lib/standalone";
// import parsers from "@miksu/prettier/lib/language-js/parser-babylon";
// prettier.format(string, {
//   parser: "babel",
//   plugins: [parsers]
// })

const LiveNative = ({ live: { error, code, element, onChange }, clean }) => {
  const [string, setString] = useState(code);
  const Comp = element || null;
  if (clean)
    return (
      <Flex w="100%" flexCenter p={25}>
        <Comp />
      </Flex>
    );
  return (
    <Flex py={30}>
      <Flex bg="primary:setAlpha:0.1" px={20} py={30}>
        {error ? null : <Comp />}
      </Flex>
    </Flex>
  );
};

const WrappedEditor = withLive(LiveNative);

export default function Table({ code, scope, title, ...rest }) {
  const theme = useTheme();
  return (
    <LiveProvider
      code={code}
      scope={{
        theme,
        Fragment,
        unikit,
        useState,
        useRef,
        Flex: unikit.Flex,
        Text: unikit.Text,
        Grid: unikit.Grid,
        Icon: unikit.Icon,
        Button: unikit.Button,
        Animate: unikit.Animate,
        [title]: unikit[title],
        ...scope,
      }}
    >
      <WrappedEditor {...rest} />
    </LiveProvider>
  );
}
