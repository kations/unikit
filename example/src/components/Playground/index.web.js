import React, { Fragment, useState, useRef } from 'react';
import { LiveProvider, withLive, LiveEditor } from 'react-live';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import './Playground.css';
import * as unikit from 'unikit';
import {
  Flex,
  Text,
  Animate,
  useTheme,
  Grid,
  useInterval,
  Icons,
} from 'unikit';
import Table from './Table';

import prettier from '@miksu/prettier/lib/standalone';
import parsers from '@miksu/prettier/lib/language-js/parser-babylon';

const LiveNative = ({
  live: { error, code, element, onChange },
  clean,
  min = 300,
  hideEditor = false,
}) => {
  const theme = useTheme();
  const [string, setString] = useState(() =>
    prettier.format(code, {
      parser: 'babel',
      plugins: [parsers],
    })
  );
  React.useEffect(() => {
    if (error) {
      theme.alert({ type: 'error', message: error });
    }
  }, [error]);
  const Comp = element || null;
  if (clean)
    return (
      <Flex w="100%" flexCenter p={25} flex={1}>
        <Comp />
      </Flex>
    );
  return (
    <Grid min={min} gap={10}>
      {hideEditor ? null : (
        <Flex flex={1} bg="#1C182C" p={10} borderRadius={10}>
          <Editor
            value={string}
            onValueChange={(text) => {
              setString(text);
              onChange(text);
            }}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
            style={{
              background: '#1C182C',
              fontFamily: '"Fira code", "Fira Mono", monospace',
              color: '#E2DCF2',
              fontSize: '1rem',
            }}
          />
        </Flex>
      )}
      <Flex
        flex={1}
        bg="primary:setAlpha:0.1"
        px={20}
        py={30}
        borderRadius={10}
      >
        {error ? null : <Comp />}
      </Flex>
    </Grid>
  );
};

const WrappedEditor = withLive(LiveNative);

export default function LiveView({
  code,
  scope,
  title,
  from,
  codeProps = {},
  ...rest
}) {
  const theme = useTheme();
  return (
    <>
      <LiveProvider
        code={code}
        scope={{
          theme,
          Fragment,
          unikit,
          useState,
          useRef,
          useInterval,
          Icons,
          Flex: unikit.Flex,
          Text: unikit.Text,
          Grid: unikit.Grid,
          Icon: unikit.Icon,
          Button: unikit.Button,
          Animate: unikit.Animate,
          Form: unikit.Form,
          Input: unikit.Input,
          Image: unikit.Image,
          Tilt: unikit.Tilt,
          Avatar: unikit.Avatar,
          [title]: unikit[title],
          ...scope,
        }}
      >
        <WrappedEditor {...codeProps} {...rest} />
      </LiveProvider>
    </>
  );
}
