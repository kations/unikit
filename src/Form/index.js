import React, {
  Children,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";

import styled from "../styled";
import Button from "../Button";
import Box from "../Box";
import { getObjValue, setObjValue } from "../util";

const FormWrap = styled(Box)({
  width: "100%"
});

const getDefaultValue = ({ child: { props } }) => {
  let value = undefined;
  if (props.type === "number" || props.type === "range") {
    value = 0;
  }
  if (props.type === "switch" || props.type === "checkbox") {
    value = false;
  }
  if (props.defaultValue) value = props.defaultValue;
  return value;
};

const getDefaultState = (children, state) => {
  React.Children.map(children, (child, i) => {
    if (
      child.key &&
      typeof child.key === "string" &&
      !getObjValue(state, child.key)
    ) {
      state = setObjValue(state, child.key, getDefaultValue({ child }));
    }
    if (child.props && child.props.children)
      getDefaultState(child.props.children, state);
  });
  return state;
};

const renderChildren = (children, doc, setDoc) => {
  return React.Children.map(children, (child, index) => {
    return React.cloneElement(child, {
      key: child.key || `child-${index}`,
      value: child.key ? getObjValue(doc, child.key) : undefined,
      onChange: value => {
        if (child.key) {
          const newDoc = Object.assign({}, doc);
          setDoc(setObjValue(newDoc || {}, child.key, value));
        }
      },
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
    button = true,
    buttonLabel = "Submit",
    buttonProps = {},
    defaultDoc = {},
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

  useImperativeHandle(ref, () => ({
    submit: () => {
      return doc;
    }
  }));

  return (
    <FormWrap {...rest}>
      {renderChildren(children, doc, setDoc)}
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

export default forwardRef(Form);
