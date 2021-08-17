import * as React from "react";

import { withThemeProps } from "../../style";
import Button from "../Button";
import Flex from "../Flex";
import Text from "../Text";
import { getValue, setValue, isWeb, isFunction } from "../../util";
import { useDebounce, useUpdateEffect } from "../../hooks";

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

const getDefaultState = (children, defaultDoc) => {
  var state = { ...defaultDoc };
  React.Children.toArray(children).map((child, i) => {
    const key =
      child.props && child.props.field ? child.props.field : undefined;
    if (
      key &&
      typeof key === "string" &&
      key.length > 0 &&
      getValue(state, key) === undefined
    ) {
      state = setValue(state, key, getDefaultValue({ child }));
    }
    if (child.props && child.props.children)
      state = getDefaultState(child.props.children, state);
  });
  return state;
};

const renderChildren = (children, doc, setDoc, inputProps) => {
  return React.Children.toArray(children).map((child, index) => {
    const key =
      child.props && child.props.field ? child.props.field : undefined;
    return React.cloneElement(child, {
      key: key || `child-${index}`,
      value: key ? getValue(doc, key) : undefined,
      onChange: key
        ? (value) => {
            setDoc(key, value);
          }
        : undefined,
      doc,
      ...inputProps,
      children:
        child.props &&
        child.props.children &&
        typeof child.props.children !== "string"
          ? renderChildren(child.props.children, doc, setDoc)
          : child.props.children,
    });
  });
};

const Form = React.forwardRef(
  (
    {
      children,
      onSubmit,
      onChange,
      onValidate,
      button = true,
      buttonLabel = "Submit",
      buttonProps = { mt: 10 },
      defaultDoc = {},
      leftAction,
      rightAction,
      inputProps = {},
      debug = false,
      onChangeDelay = 500,
      ...rest
    },
    ref
  ) => {
    const [valid, setValid] = React.useState(onValidate ? false : true);
    const [doc, setDoc] = React.useState(() => {
      return getDefaultState(children, defaultDoc);
    });

    const debouncedDoc = useDebounce(doc, onChangeDelay);

    useUpdateEffect(() => {
      if (onChange) onChange(doc);
    }, [debouncedDoc]);

    const reset = () => {
      setDoc(getDefaultState(children, defaultDoc));
    };

    React.useImperativeHandle(ref, () => ({
      submit: () => {
        if (onSubmit) onSubmit(doc, reset);
      },
      getDoc: () => doc,
      getKey: (key) => getValue(doc, key),
    }));

    const setDocState = (key, value) => {
      setDoc((doc) => {
        const newDoc = { ...(doc || {}) };
        setValue(newDoc, key, value);
        return newDoc;
      });
    };

    return (
      <Flex w="100%" {...rest} accessibilityRole={isWeb ? "form" : "none"}>
        {renderChildren(
          isFunction(children) ? children({ doc }) : children,
          doc,
          setDocState,
          inputProps
        )}
        {debug ? <Text>{JSON.stringify(doc)}</Text> : null}
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
      </Flex>
    );
  }
);

export default withThemeProps(Form, "Form");
