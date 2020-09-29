import * as React from 'react';
import { Flex } from 'unikit';

const Wrapper = ({ children, ...rest }) => {
  return (
    <Flex w="100%" flexCenter>
      <Flex maxWidth={1100} w="100%" px={20} m={0} {...rest}>
        {children}
      </Flex>
    </Flex>
  );
};

export default Wrapper;
