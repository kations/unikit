import React, { useState } from "react";
import styled from "../../style/styled";

import Headline from "./Headline";
import Text from "../primitives/Text";
import Button from "./Button";
import Overlay from "./Overlay";
import { isIphoneX } from "../../helper";

const ActionButton = styled(Button)({
  backgroundColor: "surface",
  borderColor: "rgba(0,0,0,0.05)",
  borderBottomWidth: 1
});

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

  //console.log("==>>>>", buttonProps);

  return (
    <Overlay position="bottom" height="auto" onClose={onClose} {...rest}>
      {title && <Headline>{title}</Headline>}
      {desc && <Text>{desc}</Text>}
      {actions.map((action, index) => {
        return (
          <ActionButton
            key={`action-${index}`}
            buttonTextProps={{ style: { color: "primary" } }}
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
          </ActionButton>
        );
      })}

      <ActionButton
        buttonTextProps={{ style: { color: "error" } }}
        style={{ marginBottom: isIphoneX() ? 30 : 0 }}
        onPress={onClose || null}
        color={cancelColor}
      >
        {cancelText}
      </ActionButton>
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
