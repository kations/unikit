import React, { Fragment, useRef, useEffect } from "react";
import { animated, useTransition } from "react-spring/native";
import { TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";

import styled, { useTheme } from "../styled";
import Box from "../Box";

const ChartWrap = styled(Box)({
  width: "100%",
  flexDirection: "row",
  overflow: "hidden"
});

const Chart = styled.ScrollView(({ showValue }) => ({
  position: "relative",
  flex: 1,
  height: "auto",
  width: "100%",
  paddingTop: showValue ? 20 : 0
}));

const Bar = animated(
  styled(Box)({
    alignItems: "center",
    position: "relative"
  })
);

const XAxis = styled.View({
  width: "100%",
  flexDirection: "row",
  paddingVertical: 10
});

const YAxis = styled.View(({ height, gridWidth, gridColor, showValue }) => ({
  width: "auto",
  paddingHorizontal: 10,
  height: showValue ? height + 20 : height + 10,
  justifyContent: "space-between",
  alignItems: "flex-end",
  borderRightWidth: gridWidth,
  borderColor: gridColor,
  marginTop: showValue ? 10 : 0
}));

const Label = styled.View({
  alignItems: "center",
  justifyContent: "center",
  height: 20
});

const Spacer = styled.View(({ gap }) => ({
  width: gap * 2
}));

const LabelText = styled.Text({
  fontSize: 10
});

const BarValue = styled.View(({ theme }) => ({
  position: "absolute",
  left: "-100%",
  width: "300%",
  top: -20,
  alignItems: "center",
  justifyContent: "center"
}));

const BarValueWrap = styled.View(({ theme }) => ({
  width: "100%",
  overflow: "visible"
}));

const BarValueText = styled.Text({
  width: "100%",
  font: "label",
  textAlign: "center"
});

function invlerp(a, b, v) {
  return (v - a) / (b - a);
}

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

const BarsRenderer = ({
  data,
  bars,
  selected,
  barColor,
  selectedBarColor,
  gap,
  min,
  factor,
  showValue,
  formatValue,
  barProps,
  barValueStyle,
  onPress,
  minBarWidth,
  maxBarWidth
}) => {
  const transitions = useTransition(bars, data => data.index, {
    from: { height: 0, opacity: 0 },
    leave: { height: 0, opacity: 0 },
    enter: item => ({ height: item.height, opacity: 1 }),
    update: item => ({ height: item.height }),
    unique: true,
    trail: 4000 / data.length
  });
  return transitions.map(({ item, props: { height }, key }, index) => (
    <Bar
      bg={
        item.color
          ? item.color
          : selected !== undefined && selected === item.index
          ? selectedBarColor
          : barColor
      }
      as={onPress ? TouchableOpacity : undefined}
      onPress={onPress ? () => onPress(item) : undefined}
      activeOpacity={0.8}
      key={key}
      {...barProps}
      style={{
        display: "flex",
        flexGrow: 1,
        minWidth: minBarWidth,
        maxWidth: maxBarWidth || "100%",
        marginHorizontal: gap / 2,
        height: height.interpolate(h => Math.abs(h)),
        marginBottom: height.interpolate(h =>
          h < 0 ? min * factor + h : min * factor
        ),
        ...barProps.style
      }}
    >
      {showValue ? (
        <BarValue
          style={{
            ...barValueStyle
          }}
        >
          <BarValueWrap>
            <BarValueText numberOfLines={1}>
              {formatValue ? formatValue(item.value) : item.value}
            </BarValueText>
          </BarValueWrap>
        </BarValue>
      ) : null}
    </Bar>
  ));
};

const Comp = props => {
  const {
    barProps,
    style,
    data = [],
    onPress,
    height = 300,
    width,
    maxValue,
    minBarWidth = 15,
    maxBarWidth,
    gap = 10,
    barColor = "primary",
    selected,
    selectedBarColor = "primary",
    grid = true,
    xAxis = false,
    yAxis = false,
    axisColor = "rgba(0,0,0,0.1)",
    barValueStyle = {},
    formatValue,
    formatLabel,
    showValue = false,
    labelFont = "label",
    gridWidth = 2,
    gridColor = "primary",
    labelColor = "text",
    scrollable = false,
    tickCount = 5,
    scrollToEnd = false,
    ...rest
  } = props;

  const theme = useTheme();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollable && scrollToEnd && scrollRef.current) {
      scrollRef.current.scrollToEnd();
    }
  }, [scrollRef, data]);

  if (data.length === 0) return null;

  if (typeof data[0] === "number") {
    var max = maxValue ? maxValue : Math.max.apply(null, data);
    var min = Math.min.apply(null, data);
  } else {
    var max = maxValue
      ? maxValue
      : Math.max.apply(
          null,
          data.map(a => a.value)
        );
    var min = Math.min.apply(
      null,
      data.map(a => a.value)
    );
  }

  var minNegativ = false;
  if (min > 0) {
    min = 0;
  } else {
    minNegativ = true;
    min = Math.abs(min);
  }

  const factor = height / (max + min === 0 ? 1 : max + min);

  const getHeight = number => {
    const height = number * factor;
    return height;
  };

  function calculateTicks() {
    const realMin = 0; //minNegativ ? -min : min;
    var span = max - realMin,
      step = max / tickCount,
      err = (tickCount / span) * step;

    // Filter ticks to get closer to the desired count.
    // if (err <= 0.15) step *= 10;
    // else if (err <= 0.35) step *= 5;
    // else if (err <= 0.75) step *= 2;

    // Round start and stop values to step interval.
    var tstart = Math.ceil(realMin),
      tstop = Math.floor(max / step) * step + step * 0.5,
      ticks = [];

    if (step < 1) step = 1;

    // now generate ticks
    for (var i = tstart; i < tstop; i += step) {
      ticks.push(Math.round(i));
    }
    return ticks.reverse();
  }

  if (typeof data[0] === "number") {
    var transitionData = data.map((item, index) => {
      return { value: item, label: `bar-${index}` };
    });
  } else {
    var transitionData = data;
  }

  var count = 0;
  const groupBy = (array, key) => {
    return array.reduce(function(acc, item) {
      const newItem = Object.assign({}, item, {
        index: count,
        height: getHeight(item.value)
      });
      if (acc.find(a => a.label === item.label)) {
        acc.find(a => a.label === item.label).bars.push(newItem);
      } else {
        acc.push({
          label: item[key],
          bars: [newItem]
        });
      }
      count++;
      return acc;
    }, []);
  };

  const groupedData = groupBy(transitionData, "label");

  return (
    <ChartWrap style={style}>
      {yAxis ? (
        <YAxis
          height={height - min * factor - 1}
          gridWidth={gridWidth}
          gridColor={axisColor}
          showValue={showValue}
        >
          {calculateTicks().map((y, index) => (
            <Label key={`y-${index}`}>
              <LabelText
                style={{
                  color: theme.colors[labelColor] || labelColor,
                  ...theme.fonts[labelFont]
                }}
                numberOfLines={1}
              >
                {formatLabel ? formatLabel(y) : y}
              </LabelText>
            </Label>
          ))}
        </YAxis>
      ) : null}
      <Chart
        as={!scrollable ? View : undefined}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "column",
          minWidth: "100%"
        }}
        showValue={showValue}
        ref={scrollRef}
        {...rest}
      >
        <Box
          style={{
            position: "relative",
            minWidth: "100%",
            height: height,
            flexDirection: "row",
            alignItems: "flex-end",
            paddingHorizontal: gap / 2
          }}
        >
          {grid ? (
            <Box
              position="absolute"
              left={0}
              bottom={min * factor - 1}
              width="100%"
              height={gridWidth}
              backgroundColor={gridColor}
            />
          ) : null}
          {groupedData.map((group, index) => (
            <Fragment key={index}>
              {group.bars.length > 1 ? <Spacer gap={gap} /> : null}
              <BarsRenderer
                data={data}
                bars={group.bars}
                selected={selected}
                selectedBarColor={selectedBarColor}
                gap={gap}
                min={min}
                factor={factor}
                showValue={showValue}
                formatValue={formatValue}
                barProps={barProps}
                barValueStyle={barValueStyle}
                barColor={barColor}
                minBarWidth={minBarWidth}
                maxBarWidth={maxBarWidth}
                onPress={onPress}
              />
              {group.bars.length > 1 ? <Spacer gap={gap} /> : null}
            </Fragment>
          ))}
        </Box>
        {xAxis ? (
          <XAxis
            style={{
              paddingHorizontal: gap / 2,
              borderTopWidth: 2,
              borderColor: axisColor
            }}
          >
            {groupedData.map((group, index) => (
              <Label
                key={`label-${index}`}
                style={{
                  flex: group.bars.length,
                  minWidth: minBarWidth,
                  maxWidth: maxBarWidth || "100%",
                  marginHorizontal: gap / 2
                }}
              >
                <LabelText
                  style={{
                    color: theme.colors[labelColor] || labelColor,
                    ...theme.fonts[labelFont]
                  }}
                  numberOfLines={1}
                >
                  {group.label}
                </LabelText>
              </Label>
            ))}
          </XAxis>
        ) : null}
      </Chart>
    </ChartWrap>
  );
};

Comp.propTypes = {
  value: PropTypes.bool,
  style: PropTypes.object,
  borderSize: PropTypes.number,
  onChange: PropTypes.func
};

Comp.defaultProps = {
  labelProps: {
    style: {
      color: "text"
    }
  },
  barLabelStyle: {},
  barProps: { style: {} }
};

export default Comp;
