import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export default () => {
  InnerComponent.displayName = `sui-${name}`;

  function forwardRef(props, ref) {
    return <InnerComponent {...props} forwardedRef={ref} />;
  }
  forwardRef.displayName = InnerComponent.displayName;

  const RefComponent = React.forwardRef(forwardRef);
  RefComponent.displayName = InnerComponent.displayName;

  const StyledComponent = styled(RefComponent)(p => {
    const styles = [];
    const props = getProps(p, defaultProps);
    if (func(style)) {
      styles.push(style(props));
    }
    if (func(applySystem)) {
      styles.push(applySystem(system)(props));
    }
    return styles;
  });

  StyledComponent.propTypes = {
    theme: PropTypes.object,
    ...(system
      ? system.meta.props.reduce((obj, prop) => {
          obj[prop] = PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.object
          ]);
          return obj;
        }, {})
      : {}),
    ...propTypes
  };

  StyledComponent.defaultProps = {
    ...defaultProps
  };

  return StyledComponent;
};
