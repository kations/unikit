import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import { withThemeProps } from '../../style';
import Pointer from '../Pointer';
import Button from '../Button';
import Flex from '../Flex';

const plotToSvg = (points: any[]) => {
  if (points.length > 0) {
    let path = `M ${points[0].x},${points[0].y}`;
    points.forEach((point) => {
      path += ` L ${point.x},${point.y}`;
    });
    return path;
  } else {
    return '';
  }
};

const Draw = ({
  children,
  stroke = 'black',
  strokeWidth = 2,
  smoothing = 0.2,
  strokeLinejoin = 'round',
  onDraw,
  ...rest
}) => {
  const [paths, setPaths] = React.useState([]);
  const [pointer, setPointer] = React.useState(false);
  const [points, setPoints] = React.useState([]);
  console.log({ points, pointer });

  React.useEffect(() => {
    if (!pointer) {
      setPaths((p) => [...p, plotToSvg(points)]);
      setPoints([]);
    }
  }, [pointer]);

  React.useEffect(() => {
    if (onDraw) onDraw({ paths });
  }, [paths]);

  const pathProps = {
    stroke,
    strokeWidth,
    strokeLinejoin,
    fill: 'none',
  };

  return (
    <>
      <Pointer
        mouse={false}
        w="100%"
        h={300}
        onMove={({ x, y, pointer }) => {
          if (pointer) setPoints((p) => [...p, { x, y }]);
          setPointer(pointer);
        }}
        onLeave={() => {
          setPointer(false);
        }}
        relative
        webStyle={{ cursor: 'crosshair' }}
        {...rest}
      >
        {({ width, height }) => {
          return (
            <>
              <Svg width={width} height={height}>
                <G>
                  {paths.map((path, i) => {
                    return <Path d={path} key={`path-${i}`} {...pathProps} />;
                  })}
                  <Path d={plotToSvg(points)} {...pathProps} />
                </G>
              </Svg>
              <Flex absolute r={10} b={10}>
                <Button size={34} onPress={() => setPaths([])}>
                  Clear
                </Button>
              </Flex>
            </>
          );
        }}
      </Pointer>
    </>
  );
};

export default withThemeProps(Draw, 'Draw');
