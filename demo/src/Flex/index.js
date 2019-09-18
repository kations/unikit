import styled from "../styled";
import Box from "../Box";

const getStyle = props => {
  const style = {};

  if (props.align) {
    style["alignItems"] = props.align;
  }

  if (props.content) {
    style["justifyContent"] = props.content;
  }

  if (props.wrap) {
    style["flexWrap"] = "wrap";
  }
  if (props.row) {
    style["flexDirection"] = "row";
  }
  return style;
};

const Flex = styled(Box)(props => ({
  ...getStyle(props)
}));

export default Flex;
