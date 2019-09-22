import React, { useState } from "react";

import styled from "../styled";
import Headline from "../Headline";
import Text from "../Text";
import Button from "../Button";
import Overlay from "../Overlay";
import ButtonGroup from "../ButtonGroup";

const Comp = props => {
  const {
    overrides,
    style,
    actions = [],
    onActionPress,
    onClose,
    cancelText = "Cancel",
    cancelColor = "error",
    title,
    desc,
    ...rest
  } = props;

  //console.log("==>>>>", buttonProps);

  return (
    <Overlay
      type="transparent"
      shadow={0}
      position="bottom"
      height="auto"
      onClose={onClose}
      px={20}
      {...rest}
    >
      {title && <Headline>{title}</Headline>}
      {desc && <Text>{desc}</Text>}
      <ButtonGroup mb={6} gap={0} shadow={10} vertical>
        {actions.map((action, index) => {
          return (
            <Button
              type="surface"
              alpha={0.9}
              key={`action-${index}`}
              color="primary"
              style={{
                borderColor: "rgba(0,0,0,0.05)",
                borderBottomWidth: 1
              }}
              onPress={() => {
                if (action.onPress) {
                  action.onPress();
                }
                if (onActionPress) {
                  onActionPress(action);
                }
              }}
            >
              {action.label}
            </Button>
          );
        })}
      </ButtonGroup>

      <Button
        type="surface"
        color="error"
        onPress={onClose || null}
        color={cancelColor}
        shadow={10}
        mb={20}
        alpha={0.9}
      >
        {cancelText}
      </Button>
    </Overlay>
  );
};

export default Comp;
