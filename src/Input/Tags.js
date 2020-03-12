import React, { useState } from "react";
import PropTypes from "prop-types";

import styled from "../styled";
import TextInput from "./Text";
import Icon from "../Icon";
import Animate from "../Animate";

const TagInput = styled.View(({ theme }) => ({
  width: "100%",
  position: "relative",
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  borderRadius: theme.globals.roundness
}));

const Pills = styled.View(({ theme }) => ({
  paddingLeft: theme.globals.inputGap,
  flexDirection: "row",
  flexWrap: "wrap"
}));

const Pill = styled.TouchableOpacity({
  paddingVertical: 8,
  paddingHorizontal: 18,
  backgroundColor: "primary",
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 25,
  marginRight: 5
});

const PillLabel = styled.Text({
  font: "label",
  color: "#FFF",
  marginRight: 5
});

const Comp = ({
  value = [],
  onChange,
  textInputProps = {},
  placeholder = "Add Tag...",
  submitOnString = [" ", ","],
  setFocus,
  ...rest
}) => {
  const [text, setText] = useState("");
  const submit = () => {
    if (text.length > 0) {
      const newArray = value;
      newArray.push(text);
      onChange(newArray);
      setText("");
    }
  };
  const revert = index => {
    if (index === undefined) setText(value[value.length - 1]);
    const newArray = value;
    if (index !== undefined) {
      newArray.splice(index, 1);
    } else {
      newArray.splice(-1, 1);
    }
    onChange(newArray);
  };
  return (
    <TagInput {...rest}>
      {value && value.length > 0 ? (
        <Pills>
          {value.map((string, index) => (
            <Animate
              as={Pill}
              from={{ opacity: 0, x: 20, y: 0 }}
              key={`pill-${index}`}
              activeOpacity={0.8}
              onPress={() => revert(index)}
            >
              <PillLabel>{string}</PillLabel>
              <Icon name="x" color="#FFF" size={15} lineWidth={1} />
            </Animate>
          ))}
        </Pills>
      ) : null}
      <TextInput
        value={text}
        onChange={value => {
          console.log({ value });
          if (
            value.length > 1 &&
            submitOnString.indexOf(value.substr(value.length - 1)) > -1
          ) {
            submit();
          } else {
            setText(value);
          }
        }}
        placeholder={placeholder}
        onSubmitEditing={() => submit()}
        {...textInputProps}
        style={{ width: "auto", flex: 1 }}
        setFocus={setFocus}
      />
    </TagInput>
  );
};

Comp.propTypes = {
  value: PropTypes.array,
  style: PropTypes.object,
  onChange: PropTypes.func
};

export default Comp;
