export const uniStyles = {
  //bool
  absoluteFill: {
    styl: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }
  },
  absolute: { stylKey: "position" },
  fixed: { stylKey: "position" },
  relative: { stylKey: "position" },
  sticky: { stylKey: "position" },
  //shorthand
  w: { stylKey: "width" },
  h: { stylKey: "height" },
  t: { stylKey: "top" },
  r: { stylKey: "right" },
  b: { stylKey: "bottom" },
  l: { stylKey: "left" },
  m: { stylKey: "margin" },
  mt: { stylKey: "marginTop" },
  mr: { stylKey: "marginRight" },
  mb: { stylKey: "marginBottom" },
  ml: { stylKey: "marginLeft" },
  mx: { stylKey: "marginHorizontal" },
  my: { stylKey: "marginVertical" },
  p: { stylKey: "padding" },
  pt: { stylKey: "paddingTop" },
  pr: { stylKey: "paddingRight" },
  pb: { stylKey: "paddingBottom" },
  pl: { stylKey: "paddingLeft" },
  px: { stylKey: "paddingHorizontal" },
  py: { stylKey: "paddingVertical" },
  bg: { stylKey: "backgroundColor", color: true },
  align: { stylKey: "alignItems" },
  justify: { stylKey: "justifyContent" },
  row: { stylKey: "flexDirection" },
  bw: { stylKey: "borderWidth" },
  bc: { stylKey: "borderColor", color: true },
  br: { stylKey: "borderRadius" }
};

export const styles = {
  ...uniStyles,
  //defaults
  width: {},
  fontSize: {},
  color: { color: true },
  fontFamily: {},
  textAlign: {},
  lineHeight: {},
  fontWeight: {},
  letterSpacing: {},
  display: {},
  maxWidth: {},
  minWidth: {},
  height: {},
  maxHeight: {},
  minHeight: {},
  verticalAlign: {},
  alignItems: {},
  alignContent: {},
  justifyItems: {},
  justifyContent: {},
  flexWrap: {},
  flexBasis: {},
  flexDirection: {},
  flex: {},
  justifySelf: {},
  alignSelf: {},
  order: {},
  gridGap: {},
  gridColumnGap: {},
  gridRowGap: {},
  gridColumn: {},
  gridRow: {},
  gridAutoFlow: {},
  gridAutoColumns: {},
  gridAutoRows: {},
  gridTemplateColumns: {},
  gridTemplateRows: {},
  gridTemplateAreas: {},
  gridArea: {},
  // borders
  border: {},
  borderTop: {},
  borderRight: {},
  borderBottom: {},
  borderLeft: {},
  borderWidth: {},
  borderTopWidth: {},
  borderRightWidth: {},
  borderBottomWidth: {},
  borderLeftWidth: {},
  borderColor: { color: true },
  borderTopColor: { color: true },
  borderRightColor: { color: true },
  borderBottomColor: { color: true },
  borderLeftColor: { color: true },
  borderRadius: {},
  boxShadow: {},
  opacity: {},
  overflow: {},
  background: { color: true },
  backgroundColor: { color: true },
  backgroundImage: {},
  backgroundPosition: {},
  backgroundRepeat: {},
  backgroundSize: {},
  position: {},
  zIndex: {},
  top: {},
  right: {},
  bottom: {},
  left: {}
};
