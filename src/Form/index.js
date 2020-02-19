import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import { Platform } from "react-native";

import styled from "../styled";
import Button from "../Button";
import Flex from "../Flex";
import { getObjValue, setObjValue } from "../util";

const FormWrap = styled.View({
  width: "100%"
});

const getDefaultValue = ({ child: { props } }) => {
  let value = undefined;
  if (props.type === "range") {
    value = 0;
  }
  if (props.type === "switch" || props.type === "checkbox") {
    value = false;
  }
  if (props.defaultValue) value = props.defaultValue;
  return value;
};

const getDefaultState = (children, state) => {
  React.Children.toArray(children).map((child, i) => {
    const key =
      child.props && child.props.field ? child.props.field : undefined;
    if (
      key &&
      typeof key === "string" &&
      key.length > 0 &&
      !getObjValue(state, key)
    ) {
      state = setObjValue(state, key, getDefaultValue({ child }));
    }
    if (child.props && child.props.children)
      getDefaultState(child.props.children, state);
  });
  return state;
};

const renderChildren = (children, doc, setDoc) => {
  return React.Children.toArray(children).map((child, index) => {
    const key =
      child.props && child.props.field ? child.props.field : undefined;
    return React.cloneElement(child, {
      key: key || `child-${index}`,
      value: key ? getObjValue(doc, key) : undefined,
      onChange: value => {
        if (key) {
          const newDoc = Object.assign({}, doc);
          setDoc(setObjValue(newDoc || {}, key, value));
        }
      },
      doc,
      children:
        child.props &&
        child.props.children &&
        typeof child.props.children !== "string"
          ? renderChildren(child.props.children, doc, setDoc)
          : child.props.children
    });
  });
};

function Form(
  {
    children,
    schema,
    onSubmit,
    onChange,
    onValidate,
    button = true,
    buttonLabel = "Submit",
    buttonProps = {},
    defaultDoc = {},
    leftAction,
    rightAction,
    ...rest
  },
  ref
) {
  const [doc, setDoc] = useState(() => {
    return getDefaultState(children, defaultDoc);
  });

  useEffect(() => {
    if (onChange) onChange(doc);
  }, [doc]);

  const reset = () => {
    setDoc(getDefaultState(children, defaultDoc));
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      if (onSubmit) onSubmit(doc, reset);
    }
  }));

  return (
    <FormWrap
      {...rest}
      accessibilityRole={Platform.OS === "web" ? "form" : "none"}
    >
      {renderChildren(children, doc, setDoc)}
      <Flex row jc="space-between">
        {leftAction}
        {button ? (
          <Button
            onPress={() => {
              if (onValidate) {
                const valid = onValidate(doc);
                if (valid && onSubmit) {
                  onSubmit(doc);
                }
              } else if (onSubmit) {
                onSubmit(doc, reset);
              }
            }}
            {...buttonProps}
          >
            {buttonLabel}
          </Button>
        ) : null}
        {rightAction}
      </Flex>
    </FormWrap>
  );
}

export default forwardRef(Form);
