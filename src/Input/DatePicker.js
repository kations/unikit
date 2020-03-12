import React, { useState, Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Platform, DatePickerIOS } from "react-native";
import dayjs from "dayjs";
import { createElement } from "react-native";

import styled, { useTheme } from "../styled";
import Select from "./Select";
import TextInput from "./Text";
import Box from "../Box";
import Button from "../Button";
import Overlay from "../Overlay";
import Picker from "../Picker";

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
  }
};

const WheelWrap = styled.View();

const MONTHS = short => {
  const months = [];
  const firstDay = dayjs().startOf("year");
  Array.from(Array(12).keys()).map(index => {
    months.push(
      dayjs(firstDay)
        .add(index, "month")
        .format(short ? "MMM" : "MMMM")
    );
  });
  return months;
};

const YEARS = yearsOffset => {
  const years = [];
  const firstYear = dayjs().subtract(yearsOffset, "years");
  Array.from(Array(yearsOffset + 10).keys()).map(index => {
    years.push(
      dayjs(firstYear)
        .add(index, "year")
        .format("YYYY")
    );
  });
  return years;
};

const HOURS = use24 => {
  const hours = [];
  Array.from(Array(use24 ? 24 : 12).keys()).map(index => {
    hours.push(index);
  });
  return hours;
};

const MINUTES = () => {
  const minutes = [];
  Array.from(Array(60).keys()).map(index => {
    minutes.push(index);
  });
  return minutes;
};

const WheelPicker = ({
  min,
  max,
  onChange,
  currentDate,
  yearsOffset = 100,
  type = "date",
  use24 = true
}) => {
  const currentMonth = dayjs(currentDate).format(
    type === "datetime" ? "MMM" : "MMMM"
  );
  const currentDay = parseInt(dayjs(currentDate).format("D"));
  const currentYear = dayjs(currentDate).format("YYYY");
  console.log({
    currentDay,
    currentMonth,
    currentYear,
    hour: parseInt(dayjs(currentDate).format("HH"))
  });
  return (
    <WheelWrap w="100%" mb={15} row>
      {type === "date" || type === "datetime" ? (
        <Picker
          flex={1}
          value={currentDay}
          options={Array.from(
            Array(parseInt(dayjs(currentDate).daysInMonth())).keys()
          ).map(day => day + 1)}
          onChange={(value, index) =>
            onChange(
              dayjs(currentDate)
                .startOf("month")
                .add(index, "days")
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
            onChange(
              dayjs(currentDate)
                .month(index)
                .toDate()
            )
          }
          useScrollView={Platform.OS === "web"}
        />
      ) : null}
      {type === "date" || type === "datetime" ? (
        <Picker
          flex={1}
          value={currentYear}
          options={YEARS(yearsOffset)}
          onChange={value =>
            onChange(
              dayjs(currentDate)
                .year(parseInt(value))
                .toDate()
            )
          }
          useScrollView={Platform.OS === "web"}
        />
      ) : null}
      {type === "time" || type === "datetime" ? (
        <Picker
          flex={1}
          value={parseInt(dayjs(currentDate).format("HH"))}
          options={HOURS(use24)}
          onChange={value =>
            onChange(
              dayjs(currentDate)
                .hour(parseInt(value))
                .toDate()
            )
          }
          textAlign={type === "datetime" ? "right" : "center"}
          gap={type === "datetime" ? 10 : 0}
          useScrollView={Platform.OS === "web"}
        />
      ) : null}

      {type === "time" || type === "datetime" ? (
        <Picker
          flex={1}
          value={parseInt(dayjs(currentDate).format("mm"))}
          format={v => (v < 10 ? `0${v}` : v)}
          options={MINUTES()}
          onChange={value =>
            onChange(
              dayjs(currentDate)
                .minute(parseInt(value))
                .toDate()
            )
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
  useNativePicker = false,
  min,
  max,
  ...rest
}) => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const format = types[type].format;
  const date = value ? dayjs(value).toDate() : new Date();

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
          {...rest}
          {...textInputProps}
        />
      ) : (
        <Touchable
          onPress={() => {
            setShow(true);
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
          {Platform.OS === "ios" && useNativePicker ? (
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
            <WheelPicker
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

DatePicker.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func,
  textInputProps: PropTypes.object
};

export default DatePicker;
