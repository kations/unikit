import React, { useState } from "react";
import { useTheme } from "../../style/Theme";
import styled from "../../style/styled";

import Headline from "./Headline";
import Text from "../primitives/Text";
import Button from "./Button";
import Overlay from "./Overlay";

const CloseButton = styled(Button)(props => ({
  backgroundColor: "surface",
  borderBottomWidth: 1,
  borderColor: "rgba(0,0,0,0.05)"
}));

const Comp = props => {
  const {
    overrides,
    style,
    actions,
    onActionPress,
    onClose,
    cancelText,
    cancelColor,
    title,
    desc,
    ...rest
  } = props;
  const theme = useTheme();

  //console.log("==>>>>", buttonProps);

  return (
    <Overlay position="bottom" height="auto" onClose={onClose} {...rest}>
      {title && <Headline>{title}</Headline>}
      {desc && <Text>{desc}</Text>}
      {actions.map((action, index) => {
        return (
          <Button
            key={`action-${index}`}
            onPress={() => {
              if (action.onPress) {
                action.onPress();
              }
              if (onActionPress) {
                onActionPress(action);
              }
            }}
            color="primary"
            backgroundColor="surface"
            borderBottomWidth={1}
            borderColor="rgba(0,0,0,0.05)"
          >
            {action.label}
          </Button>
        );
      })}

      <CloseButton onPress={onClose || null} color={cancelColor}>
        {cancelText}
      </CloseButton>
    </Overlay>
  );
};

Comp.defaultProps = {
  actions: [],
  title: undefined,
  desc: undefined,
  cancelText: "Cancel",
  cancelColor: "error"
};

export default Comp;
