import * as React from "react";
import { SafeAreaView } from "react-native";

import { withThemeProps, Touchable } from "../../style";

import Animate from "../Animate";

import Flex from "../Flex";

import { isNumber, randomId } from "../../util";

import alertRef from "./ref";
import Alert from "./Alert";

const AlertWrap = ({
  timeout = 2000,
  from = "bottom",
  gap = 15,
  maxWidth = 500,
  offset = 0,
  onAlert,
  onFeedback,
  messageProps = {},
  theme,
  ...rest
}) => {
  const [refMap] = React.useState(() => new WeakMap());
  const [items, setItems] = React.useState([]);
  const [backdrop, setBackdrop] = React.useState(false);

  React.useEffect(() => {
    if (items.length === 0 && backdrop) setBackdrop(false);
  }, [items, backdrop]);

  const edit = (key) => {
    setItems((state) => state.filter((a) => a.key !== key));
  };

  const remove = (key) => {
    console.log({ items, key });
    setItems((state) => [...state.filter((a) => a.key !== key)]);
  };

  const show = (alertObj) => {
    const newAlertId = `${new Date().getTime()}-${randomId()}`;

    setItems((state) => {
      if (alertObj.key) {
        const newState = state.map((a) => {
          if (a.key?.toString() === alertObj.key?.toString()) {
            return { ...a, ...alertObj };
          }
          return { ...a };
        });
        if (
          !newState.find((a) => a.key?.toString() === alertObj.key?.toString())
        ) {
          newState.push({ position: from, ...alertObj });
        }
        return newState;
      } else {
        if (alertObj.backdrop !== undefined && alertObj.backdrop !== backdrop) {
          setBackdrop(alertObj.backdrop);
        } else if (backdrop === true) {
          setBackdrop(false);
        }
        const alertTimeout =
          alertObj.timeout === false || alertObj.confirm || alertObj.actionSheet
            ? undefined
            : isNumber(alert.timeout)
            ? alert.timeout
            : timeout;
        alertObj.timeout = alertTimeout;
        if (alertObj.position === "bottom" || alertObj.position === "center") {
          return [
            ...state,
            {
              key: newAlertId.toString(),
              position: alertObj.position || "top",
              ...alertObj,
            },
          ];
        } else {
          return [
            {
              key: newAlertId.toString(),
              position: alertObj.position || "top",
              ...alertObj,
            },
            ...state,
          ];
        }
      }
    });

    if (onAlert) onAlert(alert);
    if (onFeedback) onFeedback(alert.type);

    return alertObj.key || newAlertId.toString();
  };

  React.useImperativeHandle(alertRef, () => ({
    show: (obj) => {
      const key = show(obj);
      return key;
    },
    remove,
    edit,
  }));

  const renderItem = (item) => {
    const { key, position = "top", ...rest } = item;
    return (
      <Alert
        ref={(ref) => ref && refMap.set(item, ref)}
        removeItem={() => {
          if (item.backdrop) setBackdrop(false);
          remove(key);
        }}
        component={item.component}
        maxWidth={maxWidth}
        timeout={item.timeout}
        item={rest}
        position={position}
        key={`message-${key}`}
        itemKey={`${key}`}
        {...messageProps}
      />
    );
  };
  return (
    <Flex
      py={gap / 2 + offset}
      pointerEvents="box-none"
      height="100vh"
      width="100%"
      p={theme.spacing.m}
      zIndex={9999}
      fixed
      top={0}
      left={0}
      right={0}
      bottom={0}
      justifyContent="space-between"
      {...rest}
    >
      {backdrop && items.length > 0 ? (
        <Animate
          from={{ o: 0 }}
          to={{ o: 1 }}
          height={theme.height}
          absoluteFill
          bg="rgba(0,0,0,0.25)"
          pointerEvents={backdrop && items.length > 0 ? "auto" : "none"}
          webStyle={{
            backfaceVisibility: "hidden",
            backdropFilter: "blur(1px)",
          }}
        >
          <Touchable
            height={theme.height}
            absoluteFill
            onPress={() => setItems([])}
          />
        </Animate>
      ) : null}
      <Flex w="100%" pointerEvents="box-none">
        <SafeAreaView collapsable={false} />
        {items
          .filter((i) => i.position === "top")
          .map((item) => renderItem(item))}
      </Flex>
      <Flex w="100%" pointerEvents="box-none">
        {items
          .filter((i) => i.position === "center")
          .map((item) => renderItem(item))}
      </Flex>
      <Flex w="100%" pointerEvents="box-none">
        {items
          .filter((i) => i.position === "bottom")
          .map((item) => renderItem(item))}
        <SafeAreaView collapsable={false} />
      </Flex>
    </Flex>
  );
};

export default withThemeProps(AlertWrap, "AlertWrap");
