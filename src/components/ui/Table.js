import React, { Component } from "react";
import styled, {withTheme} from "styled-components";

import PropTypes from "prop-types";

import { getProp, getObjValue } from "../../helper";
import Block from "../primitives/Block";
import Flex from "../primitives/Flex";
import Text from "../primitives/Text";

const isOdd = (num) =>{ return num % 2}

const Row = styled(Flex)`
    align-self: stretch;
    flex-direction: row;
`;

const HeadItem = styled(Flex)`
    align-self: stretch;
    flex-direction: row;
    padding: 15px;
    background-color:  ${p => getProp(p, "headBackground", "table")};
`;

const Item = styled(Flex)`
    align-self: stretch;
    flex-direction: row;
    padding: 15px;
    background-color: ${p => getProp(p, "even", "table") === true && isOdd(p.index) === 0 ? 'transparent'  :  getProp(p, "bodyBackground", "table")};
`;

const Label = styled(Text)`
    align-self: stretch;
    flex-direction: row;
`;


const Comp = (props) => {
  const {
    keys,
    data,
    style,
    even,
    ...rest,
  } = props;
  return (
    <Block
    style={style}
      {...rest}
    >
        <Row>
        {keys && keys.map((key) => <HeadItem  key={`${key}-head`}><Label>{key}</Label></HeadItem>)}
        </Row>
        {data && data.map((item, index) => 
            <Row>{keys.map((key) => <Item key={`${key}-${index}-body`} index={index} even={even}><Label>{getObjValue(item, key)}</Label></Item>)}</Row>
        )}
    </Block>
  );
};

Comp.propTypes = {
    keys: PropTypes.array,
  data: PropTypes.array,
  style: PropTypes.object,
  headBackground: PropTypes.string,
  bodyBackground: PropTypes.string,
  even: PropTypes.bool,
};

export default Comp;
