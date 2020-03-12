import React, { Children, useState } from "react";
import * as PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

import styled, { withThemeProps } from "../styled";
import Box from "../Box";
import Animate from "../Animate";

const Drop = styled(Box)({
  position: "relative"
});

const Down = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: "100%",
  minWidth: "100%",
  padding: 10,
  borderRadius: theme.globals.roundnesss,
  backgroundColor: "surface"
}));

const Dropdown = withThemeProps(
  ({ children, animateProps = {}, content = null, ...rest }) => {
    const [open, setOpen] = useState(false);
    return (
      <Drop>
        {Children.only(
          React.cloneElement(children, {
            as: TouchableOpacity,
            onPress: () => {
              setOpen(!open);
            },
            ...rest
          })
        )}
        <Animate
          as={Down}
          from={{ opacity: 0, y: 20, x: 0 }}
          isVisible={open}
          shadow={20}
          {...animateProps}
        >
          {content}
        </Animate>
      </Drop>
    );
  },
  "Dropdown"
);

Dropdown.propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  animateProps: PropTypes.object
};

export default Dropdown;
