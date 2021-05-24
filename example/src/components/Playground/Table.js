import React from 'react';
import { Flex, Text } from 'unikit';
const docgen = require('react-docgen-typescript');

const options = {
  savePropValueAsString: true,
};

// Parse a file for docgen info

const getDefaultValue = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
};

export default function Table({ component, ...rest }) {
  console.log(component);
  return null;
  // const types = parsePropTypes(component);
  // console.log({ component });
  // return (
  //   <Flex w="100%" {...rest}>
  //     <Flex bg="primary:setAlpha:0.1" p={20} py={10} mt={3} w="100%" row>
  //       <Flex flex={1}>
  //         <Text>Name</Text>
  //       </Flex>
  //       <Flex flex={1}>
  //         <Text>Type</Text>
  //       </Flex>
  //       <Flex flex={1}>
  //         <Text>Default</Text>
  //       </Flex>
  //     </Flex>
  //     {Object.keys(types).map((key) => {
  //       const { type, required } = types[key];

  //       const defaultValue =
  //         component.defaultPropTypes && component.defaultPropTypes[key]
  //           ? component.defaultPropTypes[key]
  //           : '';
  //       return (
  //         <Flex bg="primary" bgAlpha={0.1} p={20} mt={3} w="100%" key={key} row>
  //           <Flex flex={1}>
  //             <Text color="primary">{key}</Text>
  //           </Flex>
  //           <Flex flex={1}>
  //             <Text>
  //               {type.name}{' '}
  //               <Text font="label" color="text" opacity={0.5}>
  //                 {required ? 'required' : ''}
  //               </Text>
  //             </Text>
  //           </Flex>
  //           <Flex flex={1}>
  //             <Text>{defaultValue ? getDefaultValue(defaultValue) : ''}</Text>
  //           </Flex>
  //         </Flex>
  //       );
  //     })}
  //   </Flex>
  // );
}
