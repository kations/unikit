import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid
} from "react-native";
import dayjs from "dayjs";
import { createElement } from "react-native";

import styled, { useTheme } from "../styled";
import Select from "./Select";
import TextInput from "./Text";
import Box from "../Box";
import Button from "../Button";
import Overlay from "../Overlay";

const DateInput = props => createElement("input", props);

const Touchable = styled.TouchableOpacity({
  width: "100%"
});

const StyledDateInput = styled(DateInput)(({ theme }) => ({
  font: "p",
  backgroundColor: "transparent",
  width: "100%",
  paddingVertical: 10,
  borderRadius: theme.globals.roundness,
  fontSize: 15,
  margin: 0,
  borderWidth: 0,
  color: "text",
  web: {
    outlineWidth: 0,
    outlineColor: "unset",
    borderColor: "transparent"
  }
}));

const types = {
  date: {
    format: "YYYY-MM-DD"
  },
  datetime: {
    format: "YYYY-MM-DDTHH:mm"
  },
  time: {
    format: "HH:mm"
  }
};

var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    if (Platform.OS !== "web") {
      return false;
    } else {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    }
  }
};

const CalendarView = styled.View({
  width: "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 10
});

const TimePicker = styled.View({
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10
});

const CalendarItem = styled.TouchableOpacity(({ theme, active, disabled }) => ({
  width: `${100 / 7}%`,
  height: 50,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 2,
  borderColor: "surface",
  backgroundColor: active ? "primary" : "background",
  borderRadius: theme.globals.roundness,
  opacity: disabled ? 0.5 : 1
}));

const CalendarLabel = styled.Text(({ active }) => ({
  font: "p",
  color: active ? "#FFF" : "text"
}));

const CalendarMonth = styled.Text(({ active }) => ({
  font: "p",
  color: active ? "#FFF" : "text"
}));

const Calendar = ({ min, max, onChange, currentDate, type }) => {
  const [month, setMonth] = useState(currentDate);
  const firstDay = dayjs(month).startOf("month");
  const lastDay = dayjs(month).endOf("month");
  const offsetStart = firstDay.get("day");
  const offsetEnd = 6 - lastDay.get("day");

  useEffect(() => {
    setMonth(currentDate);
  }, [currentDate]);

  return (
    <Fragment>
      <CalendarView style={{ justifyContent: "space-between" }}>
        <Button
          color="surface"
          buttonTextProps={{ style: { color: "primary" } }}
          onPress={() =>
            setMonth(
              dayjs(month)
                .subtract(1, "month")
                .toDate()
            )
          }
        >
          Prev
        </Button>
        <CalendarMonth>{dayjs(month).format("MMM YYYY")}</CalendarMonth>
        <Button
          color="surface"
          buttonTextProps={{ style: { color: "primary" } }}
          onPress={() =>
            setMonth(
              dayjs(month)
                .add(1, "month")
                .toDate()
            )
          }
        >
          Next
        </Button>
      </CalendarView>
      <CalendarView>
        {["Son.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sam."].map(key => (
          <CalendarItem
            key={key}
            style={{ height: 20, backgroundColor: "transparent" }}
          >
            <CalendarLabel font="caption">{key}</CalendarLabel>
          </CalendarItem>
        ))}
      </CalendarView>
      <CalendarView>
        {offsetStart > 0
          ? Array.from(Array(offsetStart).keys()).map(day => {
              return (
                <CalendarItem key={day} activeOpacity={1}>
                  <CalendarLabel />
                </CalendarItem>
              );
            })
          : null}
        {Array.from(Array(parseInt(lastDay.format("DD"))).keys()).map(day => {
          const active = firstDay
            .add(day, "day")
            .isSame(dayjs(currentDate), "day");
          const disabled = min
            ? firstDay.add(day, "day").isBefore(dayjs(min), "day")
            : false;
          return (
            <CalendarItem
              key={day}
              activeOpacity={0.8}
              active={active}
              onPress={() => {
                onChange(firstDay.add(day, "day").toDate());
              }}
              disabled={disabled}
            >
              <CalendarLabel active={active}>{day + 1}</CalendarLabel>
            </CalendarItem>
          );
        })}
        {offsetEnd > 0
          ? Array.from(Array(offsetEnd).keys()).map(day => {
              return (
                <CalendarItem key={day} activeOpacity={1}>
                  <CalendarLabel />
                </CalendarItem>
              );
            })
          : null}
      </CalendarView>
      {type === "datetime" ? (
        <TimePicker>
          <CalendarMonth style={{ marginRight: 10, minWidth: 100 }}>
            Uhrzeit:
          </CalendarMonth>
          <Select
            value={parseInt(dayjs(currentDate).format("HH"))}
            onChange={value =>
              onChange(
                dayjs(currentDate)
                  .set("hour", value)
                  .toDate()
              )
            }
            options={Array.from(Array(24).keys()).map(number => ({
              label: `${number < 10 ? `0${number}` : number}`,
              value: number
            }))}
            style={{
              flex: 1,
              width: "auto",
              alignSelf: "stretch",
              backgroundColor: "background",
              borderRadius: 3,
              paddingHorizontal: 10,
              marginRight: 5
            }}
            inputProps={{ style: { textAlign: "center" } }}
          />
          <Select
            value={parseInt(dayjs(currentDate).format("mm"))}
            onChange={value =>
              onChange(
                dayjs(currentDate)
                  .set("minute", value)
                  .toDate()
              )
            }
            options={Array.from(Array(60).keys()).map(number => ({
              label: `${number < 10 ? `0${number}` : number}`,
              value: number
            }))}
            style={{
              flex: 1,
              width: "auto",
              alignSelf: "stretch",
              backgroundColor: "background",
              borderRadius: 3,
              paddingHorizontal: 10,
              marginLeft: 5
            }}
          />
        </TimePicker>
      ) : null}
      <TimePicker>
        <CalendarMonth style={{ marginRight: 10, minWidth: 100 }}>
          Jahr:
        </CalendarMonth>
        <Select
          value={parseInt(dayjs(currentDate).format("YYYY"))}
          onChange={value =>
            onChange(
              dayjs(currentDate)
                .set("year", value)
                .toDate()
            )
          }
          options={Array.from(Array(120).keys()).map(number => ({
            label: `${parseInt(dayjs().format("YYYY")) - number}`,
            value: parseInt(dayjs().format("YYYY")) - number
          }))}
          style={{
            flex: 1,
            width: "auto",
            alignSelf: "stretch",
            backgroundColor: "background",
            borderRadius: 3,
            paddingHorizontal: 10,
            marginRight: 5
          }}
          inputProps={{ style: { textAlign: "center" } }}
        />
      </TimePicker>
    </Fragment>
  );
};

const Comp = props => {
  const {
    value,
    style,
    type,
    onChange,
    textInputProps = {},
    overlayProps = {},
    doneText = "Done",
    min,
    max,
    ...rest
  } = props;
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const format = types[type].format;
  const date = value ? dayjs(value).toDate() : new Date();

  async function openDatePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: date,
        minDate: min,
        maxDate: max
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        console.log({ action, year, month, day });
        const newDate = dayjs(`${year}-${month + 1}-${day}`).toDate();
        onChange(newDate);
        if (type === "datetime") {
          openTimePicker(newDate);
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }

  async function openTimePicker(newDate) {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        const newDateWithTime = dayjs(newDate || date)
          .set("hour", hour)
          .set("minute", minute)
          .toDate();
        onChange(newDateWithTime);
        // Selected hour (0-23), minute (0-59)
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  }

  return (
    <Fragment>
      {Platform.OS === "web" && isMobile.any() ? (
        <StyledDateInput
          value={date ? dayjs(date).format(format) : undefined}
          type={type === "datetime" ? "datetime-local" : type}
          onChange={event => {
            onChange(event.target.value);
          }}
          min={min ? dayjs(min).format(format) : undefined}
          max={max ? dayjs(max).format(format) : undefined}
          style={style}
          {...textInputProps}
        />
      ) : (
        <Touchable
          onPress={() => {
            if (Platform.OS === "android") {
              if (type === "date" || type === "datetime") {
                openDatePicker();
              } else {
                openTimePicker();
              }
            } else {
              setShow(true);
            }
          }}
          br={theme.globals.roundness}
          style={{ width: "100%", ...style }}
          {...rest}
        >
          <TextInput
            value={date ? dayjs(date).format(format) : undefined}
            editable={isMobile.any() ? true : false}
            pointerEvents="none"
            {...textInputProps}
          />
        </Touchable>
      )}

      <Overlay
        position="center"
        height="auto"
        visible={show}
        onClose={() => setShow(false)}
        contentProps={{ p: 20, maxWidth: 500, w: "90%", bg: "surface" }}
        {...overlayProps}
      >
        <Box width="100%">
          {Platform.OS === "ios" ? (
            <DatePickerIOS
              date={date ? date : new Date()}
              mode={type}
              minimumDate={min}
              maximumDate={max}
              onDateChange={date => {
                if (onChange) {
                  onChange(date);
                }
              }}
            />
          ) : (
            <Calendar
              currentDate={date}
              onChange={value => {
                onChange(value);
              }}
              type={type}
              min={min}
              max={max}
            />
          )}
          <Button onPress={() => setShow(false)} style={{ marginBottom: 10 }}>
            {doneText}
          </Button>
        </Box>
      </Overlay>
    </Fragment>
  );
};

Comp.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func,
  textInputProps: PropTypes.object
};

export default Comp;
