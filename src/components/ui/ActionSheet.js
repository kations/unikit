import React, { useState } from "react";
import { useTheme } from "../../style/Theme";
import styled from "../../style/styled";

import Headline from "./Headline";
import Text from "../primitives/Text";
import Button from "./Button";
import Overlay from "./Overlay";

const Box = styled.View(() => {
  return {
    backgroundColor: "primary",
    width: 100,
    height: 100
  };
});

const Newbox = styled.Box(({ theme, height }) => ({
  backgroundColor: theme.colors.background,
  width: height || 100,
  height: 100
}));

const CloseButton = styled.Button(props => ({
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
      {actions.map(action => {
        return (
          <Button
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
      <Box />
      <Newbox height={200} />
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
