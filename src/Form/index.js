import React, { Children, useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";

import styled from "../styled";
import Box from "../Box";
import Button from "../Button";

const FormWrap = styled(Box)({
  width: "100%"
});

const getDefaultValue = ({ child: { props } }) => {
  let value = undefined;
  if (props.type === "text") {
    value = "";
  }
  if (props.type === "number" || props.type === "range") {
    value = 0;
  }
  if (props.type === "switch" || props.type === "checkbox") {
    value = false;
  }
  if (props.defaultValue) value = props.defaultValue;
  return value;
};

export default function Form({
  children,
  schema,
  onSubmit,
  button = true,
  buttonLabel = "Submit",
  buttonProps = {},
  ...rest
}) {
  const [doc, setDoc] = useState(() => {
    const docState = {};
    Children.map(children, (child, i) => {
      docState[child.key] = getDefaultValue({ child });
      console.log({ child });
    });
    return docState;
  });
  return (
    <FormWrap {...rest}>
      {Children.map(children, child =>
        React.cloneElement(child, {
          value: doc[child.key],
          onChange: value => {
            setDoc({ ...doc, [child.key]: value });
          }
        })
      )}
      {button ? (
        <Button
          onPress={() => (onSubmit ? onSubmit(doc) : null)}
          {...buttonProps}
        >
          {buttonLabel}
        </Button>
      ) : null}
    </FormWrap>
  );
}
