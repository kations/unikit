import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid
} from "react-native";
import { createElement } from "react-native";
import dayjs from "dayjs";

import styled from "../../style/styled";

const Touchable = styled.TouchableOpacity({
  width: "100%"
});

import TextInput from "./TextInput";
import Box from "../primitives/Box";
import Button from "../ui/Button";
import Overlay from "../ui/Overlay";

const DateInput = props => createElement("input", props);

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
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  }
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
        onChange(dayjs(`${year}-${month}-${day}`).toDate());
        if (type === "datetime") {
          openTimePicker();
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }

  async function openTimePicker() {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        dayjs().set("date", 1);
        onChange(
          dayjs(date)
            .set("hour", hour)
            .set("minute", minute)
            .toDate()
        );
        // Selected hour (0-23), minute (0-59)
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  }

  return (
    <Fragment>
      <Touchable
        onPress={() => {
          if (Platform.OS === "android") {
            if (type === "date" || type === "datetime") {
              openDatePicker();
            } else {
              openTimePicker();
            }
          } else {
            if (Platform.OS === "web") {
              if (isMobile.any()) {
              } else {
                setShow(true);
              }
            } else {
              setShow(true);
            }
          }
        }}
        style={{ width: "100%" }}
        {...rest}
      >
        <TextInput
          as={Platform.OS === "web" ? DateInput : undefined}
          value={date ? dayjs(date).format(format) : undefined}
          type={type}
          editable={false}
          pointerEvents={
            Platform.OS === "web" ? (isMobile.any() ? "all" : "none") : "none"
          }
          min={min ? dayjs(min).format(format) : undefined}
          max={max ? dayjs(max).format(format) : undefined}
          {...textInputProps}
        />
      </Touchable>

      <Overlay
        position="bottom"
        height="auto"
        visible={show}
        onClose={() => setShow(false)}
        overlayContentProps={{
          style: {
            padding: 20
          }
        }}
        backdrop
        usePan={false}
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
          ) : null}
          <Button onPress={() => setShow(false)}>{doneText}</Button>
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
