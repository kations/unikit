import * as React from 'react';

import { withThemeProps } from '../../style';
import { useDebounce, useGesture, useLayout } from '../../hooks';
import { getProgress, isWeb } from '../../util';
import Flex from '../Flex';

interface Props {
  theme: object;
  children: React.ReactNode;
  resetOnRelease?: boolean;
  mouse?: boolean;
  [key: string]: any;
}

const Pointer = ({
  theme,
  children,
  fromCenter = false,
  resetOnRelease = false,
  mouse = true,
  onMove,
  onLeave,
  ...rest
}: Props) => {
  const { width, height, onLayout } = useLayout();
  const [pointer, setPointer] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const delayedPointer = useDebounce(pointer, 500);

  const set = (pos) => {
    if (JSON.stringify(pos) !== JSON.stringify(position)) {
      setPosition(pos);
    }
  };

  React.useEffect(() => {
    if (!pointer && resetOnRelease) {
      set({ x: width / 2, y: height / 2 });
    }
  }, [pointer]);

  const pp = {
    x: fromCenter ? -(width / 2 - position.x) : position.x,
    y: fromCenter ? -(height / 2 - position.y) : position.y,
    width,
    height,
    pointer,
    delayedPointer,
    xProgress: getProgress(
      0,
      fromCenter ? width / 2 : width,
      fromCenter ? -(width / 2 - position.x) : position.x
    ),
    yProgress: getProgress(
      0,
      fromCenter ? height / 2 : height,
      fromCenter ? -(height / 2 - position.y) : position.y
    ),
  };

  React.useEffect(() => {
    if (onMove) onMove(pp);
  }, [JSON.stringify(position)]);

  const bindGesture = useGesture(
    {
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        setPointer(true);
        let { locationX, locationY } = e.nativeEvent;
        set({
          x: Math.round(Math.max(0, Math.min(locationX, width))),
          y: Math.round(Math.max(0, Math.min(locationY, height))),
        });
      },
      onPanResponderMove: (e) => {
        let { locationX, locationY } = e.nativeEvent;
        set({
          x: Math.round(Math.max(0, Math.min(locationX, width))),
          y: Math.round(Math.max(0, Math.min(locationY, height))),
        });
      },
      onPanResponderRelease: () => {
        setPointer(false);
        if (onLeave) onLeave();
      },
    },
    [width, height]
  );

  const mouseProps = mouse
    ? {
        onMouseOver: () => setPointer(true),
        onMouseMove: (e) => {
          const { layerX, layerY } = e.nativeEvent;
          set({
            x: Math.round(layerX),
            y: Math.round(layerY),
          });
        },
        onMouseLeave: () => {
          setPointer(false);
          if (onLeave) onLeave();
        },
      }
    : {};

  return (
    <Flex
      onLayout={onLayout}
      {...mouseProps}
      {...(mouse && isWeb ? {} : bindGesture)}
      {...rest}
    >
      {children instanceof Function ? children(pp) : children}
    </Flex>
  );
};

export default withThemeProps(Pointer, 'Pointer');
