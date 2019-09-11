import React, { useState, useEffect, Fragment } from "react";
import { useSpring, animated } from "react-spring/native";
import PropTypes from "prop-types";
import { View, Platform, StyleSheet, TouchableOpacity } from "react-native";

import { useTheme } from "../../style/Theme";
import styled from "../../style/styled";
import TextInput from "./TextInput";
import Icon from "../ui/Icon";

const TagInput = styled.View({
  width: "100%",
  position: "relative",
  flexDirection: "row",
  flexWrap: "wrap",
  paddingVertical: 5
});

const Pill = styled.TouchableOpacity({
  paddingVertical: 10,
  paddingHorizontal: 18,
  backgroundColor: "primary",
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 25,
  marginRight: 5,
  marginBottom: 5
});

const PillLabel = styled.Text({
  fontSize: "label",
  color: "#FFF",
  marginRight: 5
});

const Comp = ({
  value = [],
  onChange,
  textInputProps = {},
  placeholder = "Add Tag...",
  submitOnString = [" ", ","],
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
      {value.map((string, index) => (
        <Pill activeOpacity={0.8} onPress={() => revert(index)}>
          <PillLabel>{string}</PillLabel>
          <Icon name="x" color="#FFF" size={15} lineWidth={1} />
        </Pill>
      ))}
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
      />
    </TagInput>
  );
};

Comp.propTypes = {
  value: PropTypes.srting,
  style: PropTypes.object,
  onChange: PropTypes.func
};

export default Comp;
