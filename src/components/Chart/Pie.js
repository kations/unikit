import * as React from 'react';
import { View, Platform } from 'react-native';
import * as shape from 'd3-shape';
import Svg, {
  G,
  Path,
  Text as SvgText,
  Circle,
  Image,
  ClipPath,
  Defs,
} from 'react-native-svg';

import { withThemeProps, transformColor } from '../../restyle';
import { getProgress } from '../../utils';
import Text from '../Text';
import Flex from '../Flex';

function roundPathCorners(pathString, radius, useFractionalRadius) {
  function moveTowardsLength(movingPoint, targetPoint, amount) {
    var width = targetPoint.x - movingPoint.x;
    var height = targetPoint.y - movingPoint.y;

    var distance = Math.sqrt(width * width + height * height);

    return moveTowardsFractional(
      movingPoint,
      targetPoint,
      Math.min(1, amount / distance)
    );
  }
  function moveTowardsFractional(movingPoint, targetPoint, fraction) {
    return {
      x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
      y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction,
    };
  }

  // Adjusts the ending position of a command
  function adjustCommand(cmd, newPoint) {
    if (cmd.length > 2) {
      cmd[cmd.length - 2] = newPoint.x;
      cmd[cmd.length - 1] = newPoint.y;
    }
  }

  // Gives an {x, y} object for a command's ending position
  function pointForCommand(cmd) {
    return {
      x: parseFloat(cmd[cmd.length - 2]),
      y: parseFloat(cmd[cmd.length - 1]),
    };
  }

  // Split apart the path, handing concatonated letters and numbers
  var pathParts = pathString.split(/[,\s]/).reduce(function (parts, part) {
    var match = part.match('([a-zA-Z])(.+)');
    if (match) {
      parts.push(match[1]);
      parts.push(match[2]);
    } else {
      parts.push(part);
    }

    return parts;
  }, []);

  // Group the commands with their arguments for easier handling
  var commands = pathParts.reduce(function (commands, part) {
    if (parseFloat(part) == part && commands.length) {
      commands[commands.length - 1].push(part);
    } else {
      commands.push([part]);
    }

    return commands;
  }, []);

  // The resulting commands, also grouped
  var resultCommands = [];

  if (commands.length > 1) {
    var startPoint = pointForCommand(commands[0]);

    // Handle the close path case with a "virtual" closing line
    var virtualCloseLine = null;
    if (commands[commands.length - 1][0] == 'Z' && commands[0].length > 2) {
      virtualCloseLine = ['L', startPoint.x, startPoint.y];
      commands[commands.length - 1] = virtualCloseLine;
    }

    // We always use the first command (but it may be mutated)
    resultCommands.push(commands[0]);

    for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
      var prevCmd = resultCommands[resultCommands.length - 1];

      var curCmd = commands[cmdIndex];

      // Handle closing case
      var nextCmd =
        curCmd == virtualCloseLine ? commands[1] : commands[cmdIndex + 1];

      // Nasty logic to decide if this path is a candidite.
      if (
        nextCmd &&
        prevCmd &&
        prevCmd.length > 2 &&
        curCmd[0] == 'L' &&
        nextCmd.length > 2 &&
        nextCmd[0] == 'L'
      ) {
        // Calc the points we're dealing with
        var prevPoint = pointForCommand(prevCmd);
        var curPoint = pointForCommand(curCmd);
        var nextPoint = pointForCommand(nextCmd);

        // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
        var curveStart, curveEnd;

        if (useFractionalRadius) {
          curveStart = moveTowardsFractional(
            curPoint,
            prevCmd.origPoint || prevPoint,
            radius
          );
          curveEnd = moveTowardsFractional(
            curPoint,
            nextCmd.origPoint || nextPoint,
            radius
          );
        } else {
          curveStart = moveTowardsLength(curPoint, prevPoint, radius);
          curveEnd = moveTowardsLength(curPoint, nextPoint, radius);
        }

        // Adjust the current command and add it
        adjustCommand(curCmd, curveStart);
        curCmd.origPoint = curPoint;
        resultCommands.push(curCmd);

        // The curve control points are halfway between the start/end of the curve and
        // the original point
        var startControl = moveTowardsFractional(curveStart, curPoint, 0.5);
        var endControl = moveTowardsFractional(curPoint, curveEnd, 0.5);

        // Create the curve
        var curveCmd = [
          'C',
          startControl.x,
          startControl.y,
          endControl.x,
          endControl.y,
          curveEnd.x,
          curveEnd.y,
        ];
        // Save the original point for fractional calculations
        curveCmd.origPoint = curPoint;
        resultCommands.push(curveCmd);
      } else {
        // Pass through commands that don't qualify
        resultCommands.push(curCmd);
      }
    }

    // Fix up the starting point and restore the close path if the path was orignally closed
    if (virtualCloseLine) {
      var newStartPoint = pointForCommand(
        resultCommands[resultCommands.length - 1]
      );
      resultCommands.push(['Z']);
      adjustCommand(resultCommands[0], newStartPoint);
    }
  } else {
    resultCommands = commands;
  }

  return resultCommands.reduce(function (str, c) {
    return str + c.join(' ') + ' ';
  }, '');
}

function PieChart({
  theme,
  data,
  size = 100,
  dataPoints,
  innerRadius = '50%',
  outerRadius,
  cornerRadius = 3,
  color = 'primary',
  labelRadius,
  padAngle = 0.05,
  animate,
  animationDuration,
  style,
  showValue = false,
  valueAsPercent = false,
  valueProps = { fill: '#FFF', fontSize: 12 },
  sort = (a, b) => b.value - a.value,
  valueAccessor = ({ item }) => item.value,
  formatValue,
  children,
  startAngle = 0,
  endAngle = Math.PI * 2,
  legend = false,
  legendWidth,
  title,
  titleComponent,
  titleProps = {},
}) {
  function _calculateRadius(arg, max, defaultVal) {
    if (typeof arg === 'string') {
      return (arg.split('%')[0] / 100) * max;
    } else if (arg) {
      return arg;
    } else {
      return defaultVal;
    }
  }

  if (!data && dataPoints) {
    throw `"dataPoints" have been renamed to "data" to better reflect the fact that it's an array of objects`;
  }

  if (data.length === 0) {
    return <View style={style} />;
  }

  const maxRadius = size / 2;

  if (Math.min(...data.map((obj) => valueAccessor({ item: obj }))) < 0) {
    console.error(
      "don't pass negative numbers to pie-chart, it makes no sense!"
    );
  }

  const totalValue = data.reduce((acc, d) => {
    acc = acc + valueAccessor({ item: d });
    return acc;
  }, 0);

  const _outerRadius = _calculateRadius(outerRadius, maxRadius, maxRadius);
  const _innerRadius = _calculateRadius(innerRadius, maxRadius, 0);
  const _labelRadius = _calculateRadius(labelRadius, maxRadius, _outerRadius);

  if (outerRadius > 0 && _innerRadius >= outerRadius) {
    console.warn('innerRadius is equal to or greater than outerRadius');
  }

  const arcs = data.map((item) => {
    const arc = shape
      .arc()
      .cornerRadius(cornerRadius)
      .outerRadius(_outerRadius)
      .innerRadius(_innerRadius)
      .padAngle(padAngle); // Angle between sections

    item.arc &&
      Object.entries(item.arc).forEach(([key, value]) => {
        if (typeof arc[key] === 'function') {
          if (typeof value === 'string') {
            arc[key]((value.split('%')[0] / 100) * _outerRadius);
          } else {
            arc[key](value);
          }
        }
      });

    return arc;
  });

  const labelArcs = data.map((item, index) => {
    if (labelRadius) {
      return shape
        .arc()
        .outerRadius(_labelRadius)
        .innerRadius(_labelRadius)
        .padAngle(padAngle);
    }
    return arcs[index];
  });

  const pieSlices = shape
    .pie()
    .value((d) => valueAccessor({ item: d }))
    .sort(sort)
    .startAngle(startAngle)
    .endAngle(endAngle)(data);

  const slices = pieSlices.map((slice, index) => ({
    ...slice,
    pieCentroid: arcs[index].centroid(slice),
    labelCentroid: labelArcs[index].centroid(slice),
  }));

  const extraProps = {
    width: size,
    height: size,
    data,
    slices,
  };

  return (
    <Flex alignItems="center">
      <View pointerEvents={'box-none'} style={style}>
        <View pointerEvents={'box-none'}>
          <Svg
            pointerEvents={Platform.OS === 'android' && 'box-none'}
            style={{ height: size, width: size }}
          >
            <G x={size / 2} y={size / 2}>
              {pieSlices.map((slice, index) => {
                const { key, onPress, fill, ...rest } = data[index];
                return (
                  <Path
                    key={key}
                    onPress={() => {
                      if (onPress) onPress({ key, onPress, fill, ...rest });
                    }}
                    fill={transformColor({
                      value: fill ? fill : `${color}:lighten:${index * 10}`,
                      theme,
                      themeKey: 'colors',
                    })}
                    {...rest}
                    d={arcs[index](slice)}
                    animate={animate}
                    animationDuration={animationDuration}
                  />
                );
              })}
              {showValue
                ? slices.map((slice, index) => {
                    const { labelCentroid, pieCentroid, data } = slice;
                    const percentageValue = getProgress(
                      0,
                      totalValue,
                      valueAccessor({ item: data })
                    );
                    const value = valueAsPercent
                      ? (percentageValue * 100).toFixed(2)
                      : valueAccessor({ item: data });
                    const image = data.image || null;
                    const imageSize = Math.min(
                      Math.PI * 0.8 * percentageValue * 100,
                      40
                    );
                    return (
                      <>
                        {image ? (
                          <G
                            key={index}
                            x={pieCentroid[0]}
                            y={pieCentroid[1]}
                            pointerEvents="none"
                          >
                            <Image
                              rx={5}
                              x={-(imageSize / 2)}
                              y={-(imageSize / 2)}
                              width={imageSize}
                              height={imageSize}
                              preserveAspectRatio="xMidYMid slice"
                              opacity="1"
                              href={image}
                              pointerEvents="none"
                            />
                          </G>
                        ) : (
                          <SvgText
                            key={index}
                            x={pieCentroid[0]}
                            y={pieCentroid[1]}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={24}
                            strokeWidth={0}
                            fontFamily={theme.globals.fontFamily}
                            pointerEvents="none"
                            {...valueProps}
                          >
                            {formatValue
                              ? formatValue(value)
                              : valueAsPercent
                              ? `${value}%`
                              : value}
                          </SvgText>
                        )}
                      </>
                    );
                  })
                : null}
              {React.Children.map(children, (child) => {
                if (child && !child.props.belowChart) {
                  return React.cloneElement(child, extraProps);
                }
                return null;
              })}
            </G>
          </Svg>
        </View>
        {title || titleComponent ? (
          <Flex
            w={size}
            h={size}
            absoluteFill
            flexCenter
            pointerEvents="box-none"
          >
            {titleComponent || <Text {...titleProps}>{title}</Text>}
          </Flex>
        ) : null}
      </View>
      {legend ? (
        <Flex py={15} maxWidth={legendWidth || size} flexCenter row wrap>
          {pieSlices.map((slice, index) => {
            const { key, label, fill, ...rest } = data[index];
            return (
              <Flex mx={5} alignItems="center" row>
                <Flex
                  w={10}
                  h={10}
                  mr={5}
                  borderRadius={cornerRadius}
                  bg={fill ? fill : `${color}:lighten:${index * 10}`}
                />
                <Text key={key} font="label">
                  {label}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      ) : null}
    </Flex>
  );
}

export default withThemeProps(PieChart, 'PieChart');
