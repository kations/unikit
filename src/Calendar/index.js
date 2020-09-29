import React, { useState, forwardRef, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styled, { withThemeProps } from '../styled';
import { useLayout, useUpdateEffect } from '../hooks';
import { getValueByProgress } from '../util';

import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import Input from '../Input';
import Icon from '../Icon';

import Event from './Event';
import Avatar from '../Avatar';
import Dropdown from '../Dropdown';

const Wrapper = styled.View();
const ScrollY = styled.ScrollView();
const ScrollX = styled.ScrollView();
const HeadScroller = styled.ScrollView({});
const TimeStep = styled.TouchableOpacity();
const Group = styled.TouchableOpacity();
const Now = styled.View({
  position: 'absolute',
  left: 0,
  width: '100%',
  height: 1,
  backgroundColor: 'error',
  zIndex: 2000,
});

const generateTimes = ({ startTime, endTime, timeSteps }) => {
  const times = [];
  for (let i = startTime; i <= endTime; i += timeSteps) {
    var decimal = i - Math.floor(i);
    const minutes = getValueByProgress(0, 60, decimal);
    const hour = Math.floor(i);
    const time = `${hour < 10 ? `0${hour}` : hour}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
    times.push(time);
  }
  return times;
};

const generateWeek = ({ currentDay, mode = 'week', groups = [1] }) => {
  const dates = [];
  if (mode === 'week') {
    for (let i = 0; i < 7; i++) {
      const date = dayjs(currentDay).add(i, 'd');
      dates.push(date);
    }
  } else if (mode === 'day') {
    for (let i = 0; i < groups.length; i++) {
      dates.push(currentDay);
    }
  }
  return dates;
};

const getEventsWithPosition = ({
  events = [],
  colWidth,
  stepHeight,
  timeSteps,
  startTime,
  allDay = false,
  topGap,
}) => {
  colWidth = colWidth - 20;
  let maxRows = 1;
  return events.reduce((eventsAcc, event, i) => {
    const startHours = dayjs(event.date).hour() - startTime;
    const startMinutes = dayjs(event.date).minute();

    const totalStartMinutes = startHours * 60 + startMinutes;
    const top = (totalStartMinutes / (60 * timeSteps)) * stepHeight;
    const height =
      (dayjs(event.date)
        .add(event.duration, 'minutes')
        .diff(event.date, 'minutes') /
        (60 * timeSteps)) *
      stepHeight;
    const width = colWidth;
    const style = {
      top: top + topGap,
      left: 0,
      height,
      width,
    };

    const sameRow = eventsAcc.filter(
      e => e.style.top + e.style.height > style.top
    );
    const thisRow = sameRow.length + 1;
    if (thisRow > maxRows) {
      maxRows = thisRow;
    }
    const blockedPositions = [];
    let blockedWidth = 0;
    sameRow.map((item, rowIndex) => {
      const newCount = item.thisRow >= thisRow ? item.thisRow : thisRow;
      if (newCount === thisRow) {
        item.style.width = colWidth / newCount;
        item.style.left = item.position * (colWidth / newCount + 5);
        item.position = item.position !== undefined ? item.position : rowIndex;
        item.thisRow = thisRow;
      }
      blockedPositions.push(item.position);
      blockedWidth += item.style.width;
    });

    let itemPosition = 0;
    if (thisRow > 0) {
      const freeSpace = colWidth - blockedWidth;
      style.width = freeSpace;
      let setPosition = false;
      for (let j = 0; j < maxRows; j += 1) {
        if (setPosition === false) {
          var found = blockedPositions.indexOf(j) > -1;
          if (!found) {
            style.left = j * (colWidth / thisRow + 5);
            itemPosition = j;
            setPosition = true;
          }
        }
      }
    }
    if (allDay) {
      style.top = 2.5;
      style.height = topGap - 5;
    }
    eventsAcc.push({
      ...event,
      thisRow,
      position: itemPosition,
      style,
    });
    return eventsAcc;
  }, []);
};

export function Swiper(
  {
    theme,
    date = new Date(),
    onChangeDate,
    mode = 'week',
    stepHeight = 40,
    colWidth = 300,
    timeWidth = 55,
    borderOpacity = 0.08,
    topGap = 55,
    timeSteps = 0.5,
    startTime = 6,
    endTime = 23,
    onSlotPress = d => alert(d),
    onItemPress = item => alert(item.title),
    items = [
      {
        title: 'TestEvent 1',
        desc: 'Desc',
        date: dayjs()
          .subtract(1, 'hours')
          .toDate(),
        color: 'primary',
        duration: 60,
        groupId: '2',
        allDay: true,
      },
      {
        title: 'TestEvent 2',
        desc: 'Desc',
        date: dayjs()
          .subtract(1, 'hours')
          .toDate(),
        color: 'primary',
        duration: 60,
        groupId: '2',
        allDay: true,
      },
      {
        title: 'TestEvent 1',
        desc: 'Desc',
        date: dayjs()
          .subtract(1, 'hours')
          .toDate(),
        color: 'primary',
        duration: 60,
        groupId: '2',
        allDay: false,
      },
    ],
    filter = [],
    onChangeFilter,
    groups = [
      {
        name: 'Tommy',
        image:
          'https://images.unsplash.com/photo-1506252374453-ef5237291d83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60',
      },
    ],
    buttonProps = { rounded: true },
    ...rest
  },
  ref
) {
  const [currentDay, setDay] = useState(dayjs(date).startOf('week'));
  const { onLayout, width, height } = useLayout();
  const headRef = useRef(null);

  useUpdateEffect(() => {
    if (onChangeDate) onChangeDate(currentDay);
  }, [currentDay]);

  const times = generateTimes({ startTime, endTime, timeSteps });
  const week = generateWeek({ currentDay, mode, groups });
  const activeGroups = groups.filter(g => filter.indexOf(g.id) > -1 || !filter);

  const getNowTop = () => {
    const startHours = dayjs().hour() - startTime;
    const startMinutes = dayjs().minute();
    const totalStartMinutes = startHours * 60 + startMinutes;
    const top = (totalStartMinutes / (60 * timeSteps)) * stepHeight;

    return top + topGap;
  };

  console.log({ getNowTop: getNowTop() });

  return (
    <Wrapper
      flex={1}
      onLayout={onLayout}
      w="100%"
      overflow="hidden"
      relative
      {...rest}
    >
      <Flex w="100%" h={100} bg="surface" shadow={3} relative zIndex={300}>
        <Flex
          w="100%"
          row
          borderColor="text"
          alignItems="center"
          justifyContent="space-between"
          borderColorAlpha={borderOpacity}
          borderBottomWidth={1}
          px={10}
          py={10}
          relative
          zIndex={500}
        >
          <Flex row>
            <Button size={36} mr={3} rounded relative {...buttonProps}>
              <Fragment>
                <Icon name="calendar" color="#FFF" size={20} />
                <Input.DatePicker
                  style={{
                    width: 75,
                    height: 50,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    zIndex: 100,
                  }}
                  activeOpacity={0}
                  type="date"
                  value={currentDay}
                  onChange={date => setDay(dayjs(date).startOf('week'))}
                  renderBottom={setShow => (
                    <Button
                      mb={6}
                      onPress={() => {
                        setDay(dayjs().startOf('week'));
                        setShow(false);
                      }}
                    >
                      {theme.translations.showToday}
                    </Button>
                  )}
                />
              </Fragment>
            </Button>
          </Flex>
          <Flex flexCenter absoluteFill pointerEvents="box-none" row>
            <Button
              onPress={() =>
                setDay(
                  dayjs(currentDay)
                    .subtract(1, mode)
                    .toDate()
                )
              }
              bg="surface"
              size={38}
              px={9}
              light
            >
              <Icon name="arrowLeft" size={20} />
            </Button>
            <Text font="h5">
              {mode === 'week'
                ? `${dayjs(currentDay).format('DD')}-${dayjs(currentDay)
                    .endOf('week')
                    .format('DD')} ${dayjs(currentDay).format('MMM')} ${dayjs(
                    currentDay
                  ).format('YYYY')}`
                : ``}
            </Text>
            <Button
              onPress={() =>
                setDay(
                  dayjs(currentDay)
                    .add(1, mode)
                    .toDate()
                )
              }
              bg="surface"
              size={38}
              px={9}
              light
            >
              <Icon name="arrowRight" size={20} />
            </Button>
          </Flex>
          {groups.length > 0 ? (
            <Dropdown
              wrapperProps={{
                w: 325,
                r: -5,
                t: '120%',
              }}
              content={
                <Flex w="100%">
                  {groups.map((group, index) => {
                    return (
                      <Flex
                        as={Group}
                        w="100%"
                        alignItems="center"
                        justifyContent="space-between"
                        row
                        py={7}
                        onPress={() => {
                          let newFilter = [...filter];
                          if (filter.indexOf(group.id) > -1) {
                            newFilter = newFilter.filter(id => id !== group.id);
                          } else {
                            newFilter.push(group.id);
                          }
                          if (onChangeFilter) onChangeFilter(newFilter);
                        }}
                      >
                        <Flex alignItems="center" row>
                          <Avatar
                            key={`group-${index}`}
                            size={35}
                            char={group.name}
                            formatChar
                            source={{ uri: group.image }}
                            bg={group.color}
                          />
                          <Text ml={7}>{group.name}</Text>
                        </Flex>
                        <Flex pointerEvents="none">
                          <Input.Switch
                            size={25}
                            value={filter.indexOf(group.id) > -1}
                            activeTrackColor={group.color}
                          />
                        </Flex>
                      </Flex>
                    );
                  })}
                </Flex>
              }
            >
              <Flex alignItems="center" row>
                {activeGroups.map((group, index) => {
                  return (
                    <Avatar
                      key={`group-${index}`}
                      size={35}
                      char={group.name}
                      formatChar
                      source={{ uri: group.image }}
                      bg={group.color}
                      ml={-5}
                    />
                  );
                })}
                <Icon name="arrowDown" ml={3} size={20} />
              </Flex>
            </Dropdown>
          ) : null}
        </Flex>
        <HeadScroller
          ref={headRef}
          horizontal
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flex: 0, width: colWidth * 7 + timeWidth }}
          pointerEvents="none"
        >
          <Flex w={timeWidth} />
          {week.map((day, index) => {
            return (
              <Flex
                w={colWidth}
                alignItems="flex-end"
                py={5}
                row
                key={`head-${index}`}
              >
                <Text font="h4">{dayjs(day).format('DD')}</Text>
                <Text font="label" ml={5}>
                  {dayjs(day).format('dddd')}
                </Text>
              </Flex>
            );
          })}
          <Flex bg="surface" w="100%" h={100}></Flex>
        </HeadScroller>
      </Flex>
      <ScrollY flex={1} contentContainerStyle={{ flexGrow: 1 }}>
        <Flex row>
          <Flex
            w={timeWidth}
            borderColor="text"
            borderColorAlpha={borderOpacity}
            borderRightWidth={1}
            pt={topGap}
          >
            {times.map((time, index) => {
              return (
                <Flex
                  px={5}
                  h={stepHeight}
                  alignItems="flex-end"
                  key={`time-${index}`}
                >
                  <Text font="label" opacity={0.6}>
                    {time}
                  </Text>
                </Flex>
              );
            })}
          </Flex>

          <ScrollX
            style={{ height: times.length * stepHeight }}
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            horizontal
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={true}
            scrollEventThrottle={8}
            onScroll={e => {
              if (headRef && headRef.current) {
                const { contentOffset = {} } = e.nativeEvent;
                headRef.current.scrollTo({
                  x: contentOffset.x || 0,
                  animated: false,
                });
              }
            }}
          >
            {week.map((day, index) => {
              const events = getEventsWithPosition({
                events: items.filter(
                  e =>
                    (dayjs(e.date).isSame(day, 'day') &&
                      filter.indexOf(e.groupId) > -1 &&
                      !e.allDay) ||
                    (filter.length === 0 &&
                      dayjs(e.date).isSame(day, 'day') &&
                      !e.allDay)
                ),
                colWidth,
                stepHeight,
                timeSteps,
                startTime,
                endTime,
                times,
                topGap,
              });

              const allDay = getEventsWithPosition({
                events: items.filter(
                  e =>
                    (dayjs(e.date).isSame(day, 'day') &&
                      filter.indexOf(e.groupId) > -1 &&
                      e.allDay === true) ||
                    (filter.length === 0 &&
                      dayjs(e.date).isSame(day, 'day') &&
                      e.allDay === true)
                ),
                colWidth,
                stepHeight,
                timeSteps,
                startTime,
                endTime,
                times,
                allDay: true,
                topGap,
              });
              console.log({ events, allDay });
              return (
                <Flex
                  w={colWidth}
                  borderColor="text"
                  borderColorAlpha={borderOpacity}
                  borderRightWidth={index !== week.length - 1 ? 1 : 0}
                  key={`day-${index}-${dayjs(day).format('DD')}`}
                  pt={topGap}
                  relative
                >
                  <Now t={getNowTop()} pointerEvents="none" />

                  {times.map((time, i) => {
                    return (
                      <TimeStep
                        h={stepHeight}
                        borderColor="text"
                        borderColorAlpha={borderOpacity}
                        borderTopWidth={1}
                        activeOpacity={0.8}
                        key={`step-${index}-${dayjs(day).format('DD')}-${time}`}
                        onPress={() => {
                          if (onSlotPress) {
                            onSlotPress(
                              dayjs(day)
                                .hour(time.split(':')[0])
                                .minute(time.split(':')[1])
                                .toDate()
                            );
                          }
                        }}
                      />
                    );
                  })}
                  {allDay.map((event, i) => {
                    const w = colWidth / allDay.length - 10;
                    return (
                      <Event
                        allDay
                        event={event}
                        key={`all-day-event-${i}-${dayjs(day).format('DD')}`}
                        onPress={event => onItemPress(event)}
                        style={{ ...event.style, width: w, left: i * w }}
                      />
                    );
                  })}
                  {events.map((event, i) => {
                    return (
                      <Event
                        event={event}
                        key={`event-${i}-${dayjs(day).format('DD')}`}
                        onPress={event => onItemPress(event)}
                        style={event.style}
                      />
                    );
                  })}
                </Flex>
              );
            })}
          </ScrollX>
        </Flex>
      </ScrollY>
    </Wrapper>
  );
}

Swiper.propTypes = {
  activeIndex: PropTypes.number,
  children: PropTypes.node.isRequired,
  onSwipe: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  triggerDistance: PropTypes.number,
  minDistance: PropTypes.number, //Initiate animation after swipe this distance. It fix gesture collisions inside ScrollView
  springConfig: PropTypes.object,
  gesture: PropTypes.bool,
  dots: PropTypes.bool,
  dotsProps: PropTypes.object,
  itemProps: PropTypes.object,
};

export default withThemeProps(forwardRef(Swiper), 'Swiper');
