import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";

import styled, { withThemeProps } from "../styled";
import { useLayout } from "../hooks";
import { AnimatedView, useSpring, Animated } from "../Spring";
import Text from "../Text";
import Icon from "../Icon";

const { concat } = Animated;

const Wrap = styled.View();
const Collaps = styled(AnimatedView)({ overflow: "hidden" });
const Rotate = styled(AnimatedView)();
const Trigger = styled.TouchableOpacity(({ theme }) => ({
  width: "100%",
  borderRadius: theme.globals.roundness,
  justifyContent: "space-between",
  alignItems: "center",
  web: {
    cursor: "pointer",
  },
}));

const Content = styled.View(({ theme }) => ({
  width: "100%",
  borderRadius: theme.globals.roundness,
}));

const Collapsible = withThemeProps(
  ({
    collapsed = true,
    trigger = "Trigger",
    triggerColor = "#FFF",
    spacing = 15,
    font = "default",
    renderTriger = true,
    triggerProps = {},
    contentProps = {},
    icon = "chevronDown",
    iconColor = "text",
    iconSize = 20,
    children,
    ...rest
  }) => {
    const [open, setOpen] = useState(!collapsed);
    const { onLayout, height } = useLayout();

    useEffect(() => {
      setOpen(!collapsed);
    }, [collapsed]);

    const size = useSpring({
      to: open ? height : 0,
    });

    const deg = useSpring({
      to: open ? 180 : 0,
    });

    return (
      <Wrap {...rest}>
        {renderTriger ? (
          <Trigger
            onPress={() => setOpen(!open)}
            bg="primary"
            px={spacing}
            h={50}
            activeOpacity={0.8}
            row
            alignItems="center"
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
                    rotate: concat(deg, "deg"),
                  },
                ],
              }}
            >
              <Icon name={icon} size={iconSize} color={iconColor} />
            </Rotate>
          </Trigger>
        ) : null}
        <Collaps w="100%" relative style={{ height: size }}>
          <Content
            p={spacing}
            collapsable={false}
            onLayout={onLayout}
            absolute
            l={0}
            t={0}
            w="100%"
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
  children: PropTypes.node,
};

Collapsible.defaultPropTypes = {};

export default Collapsible;
