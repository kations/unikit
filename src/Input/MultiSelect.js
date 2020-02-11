import React from "react";

import styled from "../styled";
import Checkbox from "./Checkbox";

const Wrap = styled.View(({ theme }) => ({
  width: "100%",
  position: "relative",
  borderRadius: theme.globals.roundness
}));

const Select = styled.TouchableOpacity(({ theme, last }) => ({
  width: "100%",
  position: "relative",
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: theme.globals.inputGap / 1.3,
  paddingHorizontal: theme.globals.inputGap,
  borderBottomWidth: last ? 0 : 1,
  borderBottomColor: "background"
}));

const Label = styled.Text({
  font: "p",
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
