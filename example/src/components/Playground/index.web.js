import React, { Fragment, useState, useRef } from 'react';
import { LiveProvider, withLive, LiveEditor } from 'react-live';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import './Playground.css';
import * as unikit from 'unikit';
import { Flex, H3, Animate, useTheme } from 'unikit';

import Table from './Table';
import icons from './icons';

import prettier from '@miksu/prettier/lib/standalone';
import parsers from '@miksu/prettier/lib/language-js/parser-babylon';

const LiveNative = ({ live: { error, code, element, onChange }, clean }) => {
  const [string, setString] = useState(() =>
    prettier.format(code, {
      parser: 'babel',
      plugins: [parsers],
    })
  );
  const Comp = element || null;
  if (clean)
    return (
      <Flex w="100%" flexCenter p={25} flex={1}>
        <Comp />
      </Flex>
    );
  return (
    <Flex>
      <Flex bg="primary:setAlpha:0.1" px={20} py={30}>
        {error ? null : <Comp />}
      </Flex>
      <Flex bg="#1C182C" p={10}>
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
    </Flex>
  );
};

const WrappedEditor = withLive(LiveNative);

export default function LiveView({ code, scope, title, from, ...rest }) {
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
          Flex: unikit.Flex,
          Text: unikit.Text,
          Grid: unikit.Grid,
          Icon: unikit.Icon,
          Button: unikit.Button,
          Form: unikit.Form,
          Touchable: unikit.Touchable,
          useInterval: unikit.useInterval,
          icons,
          [title]: unikit[title],
          ...scope,
        }}
      >
        <WrappedEditor {...rest} />
      </LiveProvider>
      {!rest.clean ? (
        <Flex py={15} mb={150}>
          <H3 delay={500} animate>
            Props
          </H3>
          <Animate delay={500}>
            <Table
              mt={15}
              component={from === 'Input' ? unikit[from][title] : unikit[title]}
            />
          </Animate>
        </Flex>
      ) : null}
    </>
  );
}
