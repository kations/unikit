import * as React from "react";

import Animate from "../Animate";
import { withThemeProps } from "../../style";
import Pointer from "../Pointer";

const getTilt = ({ reverse, max, x, y }) => {
  const r = reverse ? -1 : 1;
  return {
    x: (r * (max / 2 - x * max)).toFixed(2) + "deg",
    y: (r * (y * max - max / 2)).toFixed(2) + "deg",
  };
};

const Tilt = ({
  children,
  reverse = false,
  max = 55,
  perspective = 1000,
  scale = 1.1,
  speed = 1000,
  axis = null,
  reset = true,
  mouse = true,
  ...rest
}) => {
  return (
    <Pointer mouse={mouse} delayedPointer={50} resetOnRelease {...rest}>
      {({ xProgress, yProgress, pointer, delayedPointer }) => {
        const tilt = getTilt({ reverse, max, x: xProgress, y: yProgress });
        return (
          <Animate
            paused={pointer === false ? pointer : delayedPointer}
            duration={500}
            style={mouse ? {} : { cursor: "grab" }}
            to={{
              perspective,
              scale: pointer ? scale : 1,
              rotateY: tilt.x,
              rotateX: tilt.y,
            }}
          >
            {children}
          </Animate>
        );
      }}
    </Pointer>
  );
};

export default withThemeProps(Tilt, "Tilt");
