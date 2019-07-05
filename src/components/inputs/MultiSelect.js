import React from "react";

import styled from "../../style/styled";
import Checkbox from "./Checkbox";

const Wrap = styled.View({
  width: "100%",
  position: "relative"
});

const Select = styled.TouchableOpacity(({ last }) => ({
  width: "100%",
  position: "relative",
  flexDirection: "row",
  alignItems: "center",
  height: 50,
  borderBottomWidth: last ? 0 : 1,
  borderBottomColor: "background"
}));

const Label = styled.Text({
  fontSize: "p",
  marginLeft: 15
});

const Comp = ({ onChange, value, options, ...rest }) => {
  const selectValue = value || [];
  return (
    <Wrap {...rest}>
      {options.map((option, index) => {
        var value = option.value ? option.value : option;
        return (
          <Select
            onPress={() => {
              let newValue = selectValue;
              var found = newValue.filter(id => id === value);
              if (found.length > 0) {
                newValue = newValue.filter(id => id !== value);
              } else {
                newValue.push(value);
              }
              console.log({ newValue });
              onChange(newValue);
            }}
            key={`multiselect-${index}`}
            activeOpacity={0.8}
            last={index === options.length - 1}
          >
            <Checkbox
              value={selectValue.filter(id => id === value).length > 0}
            />
            <Label>{option.label ? option.label : option}</Label>
          </Select>
        );
      })}
    </Wrap>
  );
};

export default Comp;
