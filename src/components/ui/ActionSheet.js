import React, { useState } from "react";

import { useTheme } from "../../style/Theme";
import { getComponents } from "../../utils";

import Headline from "./Headline";
import Text from "../primitives/Text";
import Button from "./Button";
import Overlay from "./Overlay";

const Comp = props => {
  const {
    overrides,
    style,
    actions,
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
            onPress={action.onPress || null}
            style={{
              backgroundColor: "surface",
              color: "primary",
              borderBottomWidth: 1,
              borderColor: "rgba(0,0,0,0.05)"
            }}
          >
            {action.label}
          </Button>
        );
      })}
      <Button
        onPress={onClose || null}
        style={{
          backgroundColor: "surface",
          color: "primary",
          borderBottomWidth: 1,
          borderColor: "rgba(0,0,0,0.05)"
        }}
        color={cancelColor}
      >
        {cancelText}
      </Button>
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
