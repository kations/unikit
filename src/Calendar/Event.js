import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import dayjs from "dayjs";

import Icon from "../Icon";
import Flex from "../Flex";
import Text from "../Text";

const Event = ({ event, onPress, style, allDay }) => {
  return (
    <Flex p={1} absolute overflow="hidden" pointerEvents="auto" style={style}>
      <Flex
        flex={1}
        as={TouchableOpacity}
        px={15}
        py={8}
        bg="surface"
        bgAlpha={0.9}
        onPress={() => onPress(event)}
        borderColor={event.color}
        borderLeftWidth={2}
      >
        <Text font="caption" mt={3}>
          {allDay
            ? "All Day"
            : `${dayjs(event.date).format("HH:mm")}-${dayjs(event.date)
                .add(event.duration, "minutes")
                .format("HH:mm")}`}
        </Text>
        <Text color={event.color}>{event.title}</Text>
        {event.desc && !allDay ? (
          <Text font="label" mt={3}>
            {event.desc}
          </Text>
        ) : null}
        {event.done ? (
          <Flex
            row
            style={{
              backgroundColor: event.color,
              paddingHorizontal: 8,
              paddingVertical: 3,
              position: "absolute",
              top: 0,
              right: 0,
              borderBottomLeftRadius: 5,
            }}
          >
            <Icon name="check" color="#FFF" size={17} />
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
};

const eventPropTypes = PropTypes.shape({
  color: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
});

Event.propTypes = {
  event: eventPropTypes.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

export default Event;
