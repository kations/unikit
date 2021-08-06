import * as React from 'react';
import dayjs from 'dayjs';

import { withThemeProps } from '../../style';
import { useUpdateEffect } from '../../hooks';

import Icon from '../Icon';
import Tooltip from '../Tooltip';
import Flex from '../Flex';
import Button from '../Button';
import Group from '../Group';
import Collapsible from '../Collapsible';
import Picker from '../Picker';
import Checkbox from './Checkbox';
import Text from '../Text';

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

const HOURS = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];

const MINUTES = () => {
  const minutes = [];
  Array.from(Array(60).keys()).map((index) => {
    minutes.push(index < 10 ? `0${index}` : `${index}`);
  });
  return minutes;
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
  const [timeVisible, setTime] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  useUpdateEffect(() => {
    if (dayjs(value).isValid()) {
      setDate(value);
    }
  }, [value]);

  useUpdateEffect(() => {
    if (onChange && value !== date) onChange(date);
  }, [date]);

  const onMonthChange = React.useCallback((value, index) => {
    setDate((d) => dayjs(d).month(index).toDate());
  }, []);

  const onYearChange = React.useCallback((value, index) => {
    setDate((d) => dayjs(d).year(parseInt(value)).toDate());
  }, []);

  const onHourChange = React.useCallback((value, index) => {
    setDate((d) => dayjs(d).hour(parseInt(value)).toDate());
  }, []);

  const onMinuteChange = React.useCallback((value, index) => {
    setDate((d) => dayjs(d).minute(parseInt(value)).toDate());
  }, []);

  const weeks = React.useMemo(() => getWeeks(date), [date]);
  const minutes = React.useMemo(() => MINUTES(), [date]);
  const years = React.useMemo(
    () => YEARS(minYear, maxYear),
    [minYear, maxYear]
  );
  const months = React.useMemo(() => MONTHS(false), [minYear, maxYear]);
  const currentYear = dayjs(date).format('YYYY');
  const currentMonth = dayjs(date).format('MMMM');
  const currentHour = dayjs(date).format('HH');
  const currentMinute = dayjs(date).format('mm');
  return (
    <Tooltip
      width={400}
      color="surface"
      useScrollView
      popover={
        <Flex>
          <Collapsible
            collapsed={year === false}
            onPress={() => {
              setYear(!year);
              setTime(false);
            }}
            iconColor="primary"
            renderTriger={({ open, setOpen, renderArrow }) => (
              <Flex
                row
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                p={theme.globals.gap}
              >
                <Flex row>
                  {timeVisible === true || year === true ? (
                    <Button
                      light
                      rounded
                      size={38}
                      mr={year ? 5 : 0}
                      py={0}
                      onPress={() => {
                        setYear(false);
                        setTime(false);
                      }}
                    >
                      <Icon name="chevron-left" size={20} />
                    </Button>
                  ) : null}
                  {!timeVisible ? (
                    <Button
                      light
                      rounded
                      size={38}
                      onPress={() => {
                        setYear(true);
                        setTime(false);
                      }}
                    >
                      {dayjs(date).format('MMM. YYYY')}
                    </Button>
                  ) : null}
                  {time && !year ? (
                    <Button
                      light
                      rounded
                      ml={5}
                      size={38}
                      onPress={() => {
                        setTime(true);
                        setYear(false);
                      }}
                    >
                      {dayjs(value).format('HH:mm')}
                    </Button>
                  ) : null}
                </Flex>
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
                    <Icon name="chevron-left" size={20} />
                  </Button>
                  <Button
                    size={38}
                    onPress={() => setDate(dayjs().toDate())}
                    light
                    rounded
                    py={0}
                  >
                    <Checkbox
                      value={dayjs(date).isSame(dayjs(), 'day')}
                      size={16}
                      borderSize={1}
                    />
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
                    <Icon name="chevron-right" size={20} />
                  </Button>
                </Group>
              </Flex>
            )}
          >
            {year && (
              <Flex w="100%" row>
                <Picker
                  value={currentMonth}
                  options={months}
                  onChange={onMonthChange}
                  mr={5}
                  flex={1}
                  useScrollView
                />
                <Picker
                  value={currentYear}
                  options={years}
                  onChange={onYearChange}
                  ml={5}
                  flex={1}
                  useScrollView
                />
              </Flex>
            )}
          </Collapsible>

          <Collapsible collapsed={timeVisible === false} trigger={false}>
            <Flex w="100%" row>
              <Picker
                value={currentHour}
                options={HOURS}
                onChange={onHourChange}
                mr={5}
                flex={1}
                useScrollView
              />
              <Picker
                value={currentMinute}
                options={minutes}
                onChange={onMinuteChange}
                ml={5}
                flex={1}
                useScrollView
              />
            </Flex>
          </Collapsible>

          <Collapsible
            collapsed={year === true || timeVisible === true}
            onPress={() => {
              setYear(!year);
            }}
            trigger={false}
          >
            {!year && (
              <Flex width="100%">
                {weeks.map((week, i) => {
                  return (
                    <React.Fragment key={`col-${i}`}>
                      {i === 0 && (
                        <Flex width="100%" mb={3} row>
                          {week.map((day) => {
                            return (
                              <Flex
                                key={dayjs(day).format('DD')}
                                flex={1}
                                flexCenter
                                opacity={0.5}
                                key={`head-${dayjs(day).format('ddd')}`}
                              >
                                <Text font="label" numberOfLines={1}>
                                  {dayjs(day).format('ddd')}
                                </Text>
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
                              height={45}
                              flexCenter
                              opacity={activeMonth ? 1 : 0.25}
                              rounded
                              px={0}
                            >
                              <Text font="p" bold={activeDay === true}>
                                {dayjs(day).format('D')}
                              </Text>
                            </Button>
                          );
                        })}
                      </Flex>
                    </React.Fragment>
                  );
                })}
              </Flex>
            )}
          </Collapsible>
        </Flex>
      }
    >
      <Button size={size} rounded {...rest}>
        <Icon name="calendar" size={size / 2} />
      </Button>
    </Tooltip>
  );
};

export default withThemeProps(DatePicker, 'DatePicker');
