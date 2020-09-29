import React, { useState, useEffect } from "react";

import styled, { useTheme } from "../styled";
import Switch from "./Switch";

const Wrap = styled.View(({ theme }) => ({
  width: "100%",
  position: "relative",
  borderRadius: theme.globals.roundness,
}));

const Select = styled.TouchableOpacity(({ theme, last }) => ({
  width: "100%",
  position: "relative",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: theme.globals.inputGap / 1.3,
  paddingRight: theme.globals.inputGap,
  borderBottomWidth: last ? 0 : 1,
  borderBottomColor: "background",
}));

const Label = styled.Text({
  color: "text",
  font: "p",
  marginLeft: 15,
});

const getVale = (options, value) => {
  const obj = {};
  options.map((option) => {
    obj[option.value || option] = false;
  });
  return { ...obj, ...value };
};

const Comp = ({ onChange, value, options, disabled, ...rest }) => {
  const theme = useTheme();
  const [obj, setObj] = useState(() => getVale(options, value));

  useEffect(() => {
    console.log({ obj });
    onChange(obj);
  }, [obj]);

  return (
    <Wrap opacity={!disabled ? 1 : 0.5} {...rest}>
      {options.map((option, index) => {
        var value = option.value ? option.value : option;
        return (
          <Select
            onPress={
              disabled
                ? undefined
                : () => {
                    setObj({ ...obj, [value]: !obj[value] });
                    if (theme.onFeedback) theme.onFeedback("success");
                  }
            }
            key={`multiselect-${index}`}
            activeOpacity={0.8}
            last={index === options.length - 1}
          >
            <Label>{option.label ? option.label : option}</Label>
            <Switch
              value={obj[value] || false}
              size={34}
              onChange={(v) => setObj({ ...obj, [value]: !obj[value] })}
            />
          </Select>
        );
      })}
    </Wrap>
  );
};

export default Comp;
