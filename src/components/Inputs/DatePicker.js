import * as React from 'react';
import dayjs from 'dayjs';

import { withThemeProps } from '../../restyle';
import { isWeb } from '../../utils';
import { useUpdateEffect } from '../../hooks';

import Icon from '../Icon';
import Overlay from '../Overlay';
import Flex from '../Flex';
import Button from '../Button';
import Group from '../Group';
import Collapsible from '../Collapsible';
import Touchable from '../Touchable';
import Picker from '../Picker';
import TextInput from './Text';
import { Label, P } from '../HTML';

const YEARS = (min, max) => {
  const years = [];
  const firstYear = dayjs().year(min);
  Array.from(Array(max - (min - 1)).keys()).map((index) => {
    years.push(dayjs(firstYear).add(index, 'year').format('YYYY'));
  });
  return years;
};

const MONTHS = (short) => {
  const months = [];
  const firstDay = dayjs().startOf('year');
  Array.from(Array(12).keys()).map((index) => {
    months.push(
      dayjs(firstDay)
        .add(index, 'month')
        .format(short ? 'MMM' : 'MMMM')
    );
  });
  return months;
};

const getWeeks = (date) => {
  const weeks = [];
  let start = dayjs(dayjs(date).startOf('month')).startOf('week');
  while (weeks.length < 6) {
    const week = [];
    Array.from(Array(7).keys()).map((index) => {
      week.push(dayjs(start).add(weeks.length * 7 + index, 'day'));
    });
    weeks.push(week);
  }
  return weeks;
};

// const List = React.memo(
//     React.forwardRef(
//       ({ color, showText, style, onScroll, onItemIndexChange }, ref) => {
//         return (
//           <Animated.FlatList
//             ref={ref}
//             data={data}
//             style={style}
//             keyExtractor={(item) => `${item.name}-${item.icon}`}
//             bounces={false}
//             scrollEnabled={!showText}
//             scrollEventThrottle={16}
//             onScroll={onScroll}
//             decelerationRate='fast'
//             snapToInterval={ITEM_HEIGHT}
//             showsVerticalScrollIndicator={false}
//             renderToHardwareTextureAndroid
//             contentContainerStyle={{
//               paddingTop: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
//               paddingBottom: showText ? 0 : height / 2 - ITEM_HEIGHT / 2,
//               paddingHorizontal: 20,
//             }}
//             renderItem={({ item }) => {
//               return <Item {...item} color={color} showText={showText} />;
//             }}
//             onMomentumScrollEnd={(ev) => {
//               const newIndex = Math.round(
//                 ev.nativeEvent.contentOffset.y / ITEM_HEIGHT
//               );

//               if (onItemIndexChange) {
//                 onItemIndexChange(newIndex);
//               }
//             }}
//           />
//         );
//       }
//     )
//   );

const DatePicker = ({
  size = 44,
  theme,
  value,
  onChange,
  overlayProps = {},
  dayColor = 'text',
  time = false,
  minYear = 1900,
  maxYear = 2100,
  ...rest
}) => {
  const [year, setYear] = React.useState(false);
  const [date, setDate] = React.useState(
    dayjs(value).isValid() ? value : new Date()
  );
  const [visible, setVisible] = React.useState(false);

  useUpdateEffect(() => {
    if (dayjs(value).isValid()) {
      setDate(value);
    }
  }, [value]);

  useUpdateEffect(() => {
    if (onChange && value !== date) onChange(date);
  }, [date]);

  const weeks = React.useMemo(() => getWeeks(date), [date]);
  const currentYear = dayjs(date).format('YYYY');
  const currentMonth = dayjs(date).format('MMMM');

  return (
    <>
      <Button
        size={size}
        onPress={() => {
          setVisible(true);
        }}
        rounded
        {...rest}
      >
        <Icon name="calendar" size={size / 2} />
      </Button>
      <Overlay
        visible={visible}
        maxWidth={450}
        onClose={() => setVisible(false)}
        p={0}
      >
        <Flex>
          <Collapsible
            collapsed={year === false}
            onPress={() => setYear(!year)}
            iconColor="primary"
            renderTriger={({ open, setOpen, renderArrow }) => (
              <Flex
                row
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                p={theme.globals.gap}
              >
                <Touchable
                  onPress={() => {
                    setOpen(!open);
                    setYear(!year);
                  }}
                  row
                  alignItems="center"
                  height={38}
                  flex={1}
                >
                  <P mr={5}>{dayjs(date).format('MMMM YYYY')}</P>
                  {renderArrow}
                </Touchable>
                <Group width={100} ml={10} gap={1}>
                  <Button
                    size={38}
                    onPress={() =>
                      setDate(dayjs(date).subtract(1, 'month').toDate())
                    }
                    light
                    rounded
                    py={0}
                  >
                    <Icon name="chevronLeft" size={20} />
                  </Button>
                  <Button
                    size={38}
                    onPress={() =>
                      setDate(dayjs(date).add(1, 'month').toDate())
                    }
                    light
                    rounded
                    py={0}
                  >
                    <Icon name="chevronRight" size={20} />
                  </Button>
                </Group>
              </Flex>
            )}
          >
            {year && (
              <Flex w="100%" row>
                <Picker
                  value={currentMonth}
                  options={MONTHS(false)}
                  onChange={(value, index) =>
                    setDate(dayjs(date).month(index).toDate())
                  }
                  mr={5}
                  flex={1}
                  useScrollView
                />
                <Picker
                  value={currentYear}
                  options={YEARS(minYear, maxYear)}
                  onChange={(value) =>
                    setDate(dayjs(date).year(parseInt(value)).toDate())
                  }
                  ml={5}
                  flex={1}
                  useScrollView
                />
              </Flex>
            )}
          </Collapsible>

          <Collapsible
            collapsed={year === true}
            onPress={() => setYear(!year)}
            trigger={false}
          >
            {!year && (
              <Flex width="100%">
                {weeks.map((week, i) => {
                  return (
                    <React.Fragment key={`col-${i}`}>
                      {i === 0 && (
                        <Flex width="100%" row>
                          {week.map((day) => {
                            return (
                              <Flex
                                key={dayjs(day).format('DD')}
                                flex={1}
                                borderWidth={1}
                                borderColor="surface"
                                flexCenter
                                opacity={0.5}
                                key={`head-${dayjs(day).format('ddd')}`}
                              >
                                <Label numberOfLines={1}>
                                  {dayjs(day).format('ddd')}
                                </Label>
                              </Flex>
                            );
                          })}
                        </Flex>
                      )}
                      <Flex width="100%" row>
                        {week.map((day) => {
                          const activeDay = dayjs(date).isSame(day, 'day');
                          const activeMonth = dayjs(date).isSame(day, 'month');

                          return (
                            <Button
                              key={`week-${i}`}
                              onPress={() => {
                                setDate(dayjs(date).date(day.date()).toDate());
                              }}
                              key={dayjs(day).format('D')}
                              clean={!activeDay}
                              color={activeDay ? undefined : dayColor}
                              flex={1}
                              borderWidth={1}
                              borderColor="surface"
                              height={45}
                              flexCenter
                              opacity={activeMonth ? 1 : 0.25}
                              rounded
                              px={0}
                            >
                              <P bold={activeDay === true}>
                                {dayjs(day).format('D')}
                              </P>
                            </Button>
                          );
                        })}
                      </Flex>
                    </React.Fragment>
                  );
                })}
                {time && (
                  <TextInput
                    mask={'time'}
                    label="Time"
                    inline
                    value={value}
                    onChange={(v) => onChange(v)}
                  />
                )}
              </Flex>
            )}
          </Collapsible>
        </Flex>
      </Overlay>
    </>
  );
};

export default withThemeProps(DatePicker, 'DatePicker');
