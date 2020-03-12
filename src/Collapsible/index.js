import React, { useState } from "react";
import * as PropTypes from "prop-types";
import { animated, useSpring } from "react-spring/native";

import styled, { withThemeProps } from "../styled";
import { useLayout, useGesture, useInterval } from "../hooks";

import Box from "../Box";
import Text from "../Text";
import Icon from "../Icon";

const Wrap = styled.View();
const Collaps = animated(styled.View({ overflow: "hidden" }));
const Rotate = animated(styled.View());
const Trigger = styled.TouchableOpacity(({ theme }) => ({
  width: "100%",
  borderRadius: theme.globals.roundness,
  justifyContent: "space-between",
  alignItems: "center",
  web: {
    cursor: "pointer"
  }
}));

const Content = styled.View(({ theme }) => ({
  width: "100%",
  borderRadius: theme.globals.roundness
}));

const Collapsible = withThemeProps(
  ({
    collapsed = true,
    trigger = "Trigger",
    triggerColor = "#FFF",
    spacing = 15,
    font = "default",
    triggerProps = {},
    contentProps = {},
    children,
    ...rest
  }) => {
    const [open, setOpen] = useState(!collapsed);
    const { onLayout, width, height } = useLayout();
    const { size, deg } = useSpring({
      size: open ? height : 0,
      deg: open ? 180 : 0
    });

    console.log({ height });

    return (
      <Wrap {...rest}>
        <Trigger
          onPress={() => setOpen(!open)}
          bg="primary"
          p={spacing}
          activeOpacity={0.8}
          row
          {...triggerProps}
        >
          {typeof trigger === "string" ? (
            <Text font={font} color={triggerColor}>
              {trigger}
            </Text>
          ) : (
            trigger
          )}

          <Rotate
            style={{
              transform: [
                {
                  rotate: deg.interpolate(d => `${d}deg`)
                }
              ]
            }}
          >
            <Icon name="arrowDown" size={20} color="#FFF" />
          </Rotate>
        </Trigger>
        <Collaps w="100%" style={{ height: size }}>
          <Content
            p={spacing}
            collapsable={false}
            onLayout={onLayout}
            {...contentProps}
          >
            {children}
          </Content>
        </Collaps>
      </Wrap>
    );
  },
  "Collapsible"
);

Collapsible.propTypes = {
  children: PropTypes.node
};

Collapsible.defaultProps = {};

export default Collapsible;
