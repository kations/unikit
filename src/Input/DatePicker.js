import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
} from "react-native";
import dayjs from "dayjs";
import { createElement } from "react-native";

import styled, { useTheme } from "../styled";
import TextInput from "./Text";
import Box from "../Box";
import Button from "../Button";
import Overlay from "../Overlay";
import Picker from "../Picker";
import { useUpdateEffect } from "../hooks";

const DateInput = (props) => createElement("input", props);

const Touchable = styled.TouchableOpacity({
  width: "100%",
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
    borderColor: "transparent",
  },
}));

const types = {
  date: {
    format: "YYYY-MM-DD",
  },
  datetime: {
    format: "YYYY-MM-DDTHH:mm",
  },
  time: {
    format: "HH:mm",
  },
};

var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    if (Platform.OS !== "web") {
      return false;
    } else {
      if (typeof navigator !== "undefined") {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        );
      } else {
        return false;
      }
    }
  },
};

const WheelWrap = styled.View();

const MONTHS = (short) => {
  const months = [];
  const firstDay = dayjs().startOf("year");
  Array.from(Array(12).keys()).map((index) => {
    months.push(
      dayjs(firstDay)
        .add(index, "month")
        .format(short ? "MMM" : "MMMM")
    );
  });
  return months;
};

const YEARS = (yearsOffset) => {
  const years = [];
  const firstYear = dayjs().subtract(yearsOffset, "years");
  Array.from(Array(yearsOffset + 10).keys()).map((index) => {
    years.push(dayjs(firstYear).add(index, "year").format("YYYY"));
  });
  return years;
};

const HOURS = (use24) => {
  const hours = [];
  Array.from(Array(use24 ? 24 : 12).keys()).map((index) => {
    hours.push(index);
  });
  return hours;
};

const MINUTES = () => {
  const minutes = [];
  Array.from(Array(60).keys()).map((index) => {
    minutes.push(index);
  });
  return minutes;
};

export const WheelPicker = ({
  min,
  max,
  onChange,
  value,
  yearsOffset = 100,
  type = "date",
  use24 = true,
}) => {
  const [date, setDate] = useState(value || new Date());
  const currentMonth = dayjs(date).format(type === "datetime" ? "MMM" : "MMMM");
  const currentDay = parseInt(dayjs(date).format("D"));
  const currentYear = dayjs(date).format("YYYY");

  useUpdateEffect(() => {
    setTimeout(() => {
      onChange(date);
    }, 50);
  }, [date]);

  return (
    <WheelWrap w="100%" mb={15} row>
      {type === "date" || type === "datetime" ? (
        <Picker
          flex={1}
          value={currentDay}
          options={Array.from(
            Array(parseInt(dayjs(date).daysInMonth())).keys()
          ).map((day) => day + 1)}
          onChange={(value, index) =>
            setDate(
              dayjs(date)
                .date(index + 1)
                .toDate()
            )
          }
          useScrollView={Platform.OS === "web"}
        />
      ) : null}
      {type === "date" || type === "datetime" ? (
        <Picker
          flex={1}
          value={currentMonth}
          options={MONTHS(type === "datetime")}
          onChange={(value, index) =>
            setDate(dayjs(date).month(index).toDate())
          }
          useScrollView={Platform.OS === "web"}
        />
      ) : null}
      {type === "date" || type === "datetime" ? (
        <Picker
          flex={1}
          value={currentYear}
          options={YEARS(yearsOffset)}
          onChange={(value) =>
            setDate(dayjs(date).year(parseInt(value)).toDate())
          }
          useScrollView={Platform.OS === "web"}
        />
      ) : null}
      {type === "time" || type === "datetime" ? (
        <Picker
          flex={1}
          value={parseInt(dayjs(date).format("HH"))}
          options={HOURS(use24)}
          onChange={(value) =>
            setDate(dayjs(date).hour(parseInt(value)).toDate())
          }
          textAlign={type === "datetime" ? "right" : "center"}
          gap={type === "datetime" ? 10 : 0}
          useScrollView={Platform.OS === "web"}
        />
      ) : null}

      {type === "time" || type === "datetime" ? (
        <Picker
          flex={1}
          value={parseInt(dayjs(date).format("mm"))}
          format={(v) => (v < 10 ? `0${v}` : v)}
          options={MINUTES()}
          onChange={(value) =>
            setDate(dayjs(date).minute(parseInt(value)).toDate())
          }
          useScrollView={Platform.OS === "web"}
        />
      ) : null}
    </WheelWrap>
  );
};

const DatePicker = ({
  value,
  style,
  type = "date",
  onChange,
  textInputProps = {},
  overlayProps = {},
  doneText = "Close",
  useNativePicker = true,
  renderTop,
  renderBottom,
  min,
  max,
  ...rest
}) => {
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
        maxDate: max,
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
        is24Hour: false, // Will display '2 PM'
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
          onChange={(event) => {
            onChange(event.target.value);
          }}
          min={min ? dayjs(min).format(format) : undefined}
          max={max ? dayjs(max).format(format) : undefined}
          style={style}
          {...rest}
          {...textInputProps}
        />
      ) : (
        <Touchable
          onPress={() => {
            if (Platform.OS === "android" && useNativePicker) {
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
          w="100%"
          style={{ ...style }}
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
        contentProps={{ maxWidth: 500, w: "90%", bg: "surface" }}
        {...overlayProps}
      >
        <Box width="100%">
          {renderTop ? renderTop(setShow) : renderTop}
          {Platform.OS === "ios" && useNativePicker ? (
            <DatePickerIOS
              date={date ? date : new Date()}
              mode={type}
              minimumDate={min}
              maximumDate={max}
              onDateChange={(date) => {
                if (onChange) {
                  onChange(date);
                }
              }}
            />
          ) : (
            <WheelPicker
              value={date}
              onChange={(value) => {
                onChange(value);
              }}
              type={type}
              min={min}
              max={max}
            />
          )}
          {renderBottom ? renderBottom(setShow) : null}
          <Button onPress={() => setShow(false)} light>
            {theme.translations.done}
          </Button>
        </Box>
      </Overlay>
    </Fragment>
  );
};

DatePicker.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func,
  textInputProps: PropTypes.object,
};

DatePicker.WheelPicker = WheelPicker;

export default DatePicker;
