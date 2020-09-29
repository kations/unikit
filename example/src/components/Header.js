import React from 'react';
import { Flex, H1, Tabs, Icon } from 'unikit';

import Wrapper from './Wrapper';
import Link from './Link';
import { useAppContext } from '../AppContext';

const Header = ({ to, params = {}, children }) => {
  const { set, dark } = useAppContext();
  return (
    <Flex
      bg="surface"
      shadow={5}
      w="100%"
      h={60}
      flexCenter
      fixed
      zIndex={999}
      t={0}
      l={0}
      webStyle={{ transitionDuration: '0.5s', transitionProperty: 'all' }}
    >
      <Wrapper justifyContent="space-between" alignItems="center" row>
        <Link to="Unikit">
          <H1 font="h4">Unikit</H1>
        </Link>
        <Tabs
          roundness={40}
          size={40}
          value={dark}
          onChange={(v) => set({ dark: v })}
          bg="transparent"
          options={[
            {
              value: false,
              label: ({ color, active }) => (
                <Icon name="sun" size={20} color={color} animate={active} />
              ),
            },
            {
              value: true,
              label: ({ color, active }) => (
                <Icon name="moon" size={20} color={color} animate={active} />
              ),
            },
          ]}
        />
      </Wrapper>
    </Flex>
  );
};

export default Header;
