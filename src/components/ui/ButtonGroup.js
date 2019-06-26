import React from "react";

import styled from "../../style/styled";

const ButtonGroup = styled.View(({ size }) => ({
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "stretch",
  borderRadius: 5,
  overflow: "hidden"
}));

const getBorderRadius = (index, length) => {
  console.log({ index, length });
  if (index === 0) {
    return {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    };
  } else if (index === length - 1) {
    return {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    };
  } else {
    return {
      borderRadius: 0
    };
  }
};

const Comp = ({ children, gap, buttonStyle, ...rest }) => {
  return (
    <ButtonGroup {...rest}>
      {React.Children.map(children, (c, i) =>
        React.cloneElement(c, {
          style: {
            flex: 1,
            marginLeft: i === 0 ? 0 : gap,
            marginTop: gap,
            ...getBorderRadius(i, React.Children.count(children)),
            ...buttonStyle
          }
        })
      )}
    </ButtonGroup>
  );
};

Comp.defaultProps = {
  gap: 1
};

export default Comp;
