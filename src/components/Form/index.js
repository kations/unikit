import * as React from 'react';
import { Platform } from 'react-native';

import { withThemeProps } from '../../restyle';
import Button from '../Button';
import Flex from '../Flex';
import { getObjValue, setObjValue } from '../../utils';

const getDefaultValue = ({ child: { props } }) => {
  let value = undefined;
  if (props.type === 'range') {
    value = 0;
  }
  if (props.type === 'switch' || props.type === 'checkbox') {
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
      typeof key === 'string' &&
      key.length > 0 &&
      getObjValue(state, key) === undefined
    ) {
      state = setObjValue(state, key, getDefaultValue({ child }));
    }
    if (child.props && child.props.children)
      state = getDefaultState(child.props.children, state);
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
      onChange: key
        ? (value) => {
            setDoc(key, value);
          }
        : undefined,
      doc,
      children:
        child.props &&
        child.props.children &&
        typeof child.props.children !== 'string'
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
      buttonLabel = 'Submit',
      buttonProps = { mt: 10 },
      defaultDoc = {},
      leftAction,
      rightAction,
      ...rest
    },
    ref
  ) => {
    const [doc, setDoc] = React.useState(() => {
      return getDefaultState(children, defaultDoc);
    });

    React.useEffect(() => {
      if (onChange) onChange(doc);
    }, [doc]);

    const reset = () => {
      setDoc(getDefaultState(children, defaultDoc));
    };

    React.useImperativeHandle(ref, () => ({
      submit: () => {
        if (onSubmit) onSubmit(doc, reset);
      },
    }));

    const setDocState = (key, value) => {
      console.log({ key, value });
      setDoc((doc) => {
        const newDoc = { ...(doc || {}) };
        setObjValue(newDoc, key, value);
        return newDoc;
      });
    };

    return (
      <Flex
        w="100%"
        {...rest}
        accessibilityRole={Platform.OS === 'web' ? 'form' : 'none'}
      >
        {renderChildren(children, doc, setDocState)}
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

export default withThemeProps(Form, 'Form');
