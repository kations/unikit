import * as React from "react";
import { Platform, SafeAreaView, TouchableOpacity } from "react-native";
import * as PropTypes from "prop-types";
import color from "tinycolor2";

import styled, { useThemeProps, useTheme } from "../styled";
import Icon from "../Icon";
import Button from "../Button";
import Animate from "../Animate";
import Flex from "../Flex";
import Text from "../Text";
import Progress from "../Progress";
import { isNumber, isDark } from "../util";

const Container = styled.View(({ from, gap }) => ({
  position: Platform.OS === "web" ? "fixed" : "absolute",
  left: 0,
  bottom: from === "bottom" ? 0 : "auto",
  top: from === "top" ? 0 : "auto",
  width: "100%",
  zIndex: 9999,
  paddingHorizontal: gap,
}));

const Message = React.forwardRef(
  ({ children, timeout, removeItem, itemKey, ...rest }, ref) => {
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
      if (isNumber(timeout)) {
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            removeItem();
          }, 250);
        }, timeout);
      }
    }, [timeout]);

    return (
      <Animate
        ref={ref}
        key={itemKey}
        from={{ y: -100, o: 0 }}
        to={{ y: 0, o: 1 }}
        w="auto"
        isVisible={visible}
        flexCenter
        relative
        {...rest}
      >
        {children}
      </Animate>
    );
  }
);

const Alert = React.forwardRef((props, ref) => {
  const {
    children,
    timeout = 2000,
    from = "top",
    gap = 15,
    maxWidth = 700,
    offset = 20,
    onAlert,
    onFeedback,
    messageProps = {},
    theme,
    ...rest
  } = useThemeProps(props, "Alert");

  const [refMap] = React.useState(() => new WeakMap());
  const [items, setItems] = React.useState([]);

  // const transitions = useTransition(items, (items) => items.key, {
  //   from: { opacity: 0, top: from === "bottom" ? 30 : -30 },
  //   enter: { opacity: 1, top: 0 },
  //   leave: { opacity: 0, top: from === "bottom" ? 30 : -30 },
  //   onRest: (item) =>
  //     setTimeout(() => {
  //       setItems((state) => state.filter((i) => i.key !== item.key));
  //     }, item.timeout || timeout),
  // });

  const edit = (key) => {
    setItems((state) => state.filter((a) => a.key !== key));
  };

  const remove = (key) => {
    setItems((state) => state.filter((a) => a.key !== key));
  };

  const show = (alert) => {
    const newAlertId = new Date().getTime();
    const alertTimeout =
      alert.timeout === false
        ? undefined
        : isNumber(alert.timeout)
        ? alert.timeout
        : timeout;
    alert.timeout = alertTimeout;
    setItems((state) => {
      if (alert.key) {
        const newState = state.map((a) => {
          if (a.key === alert.key) return { ...a, ...alert };
          return { ...a };
        });
        return newState;
      } else if (from === "bottom") {
        return [...state, { key: newAlertId, ...alert }];
      } else {
        return [{ key: newAlertId, ...alert }, ...state];
      }
    });

    if (onAlert) onAlert(alert);
    if (onFeedback) onFeedback(alert.type);

    return newAlertId;
  };

  React.useImperativeHandle(ref, () => ({
    show,
    remove,
    edit,
  }));

  // useEffect(() => {
  //   if (alert) {
  //     if (from === "bottom") {
  //       setItems((state) => [...state, { key: id++, ...alert }]);
  //     } else {
  //       setItems((state) => [{ key: id++, ...alert }, ...state]);
  //     }
  //     if (onAlert) onAlert(alert);
  //     if (onFeedback) onFeedback(alert.type);
  //   }
  // }, [alert, from]);

  const renderMessage = ({ item }) => {
    const textColor = isDark(theme.colors[item.type || "surface"])
      ? color(theme.colors[item.type || "surface"])
          .lighten(50)
          .toString()
      : color(theme.colors[item.type || "surface"])
          .darken(50)
          .toString();

    return (
      <>
        <Flex alignItems="center" row>
          {item.loading || item.icon ? (
            <Flex w={30} h="100%" maxHeight={35} justifyContent="center">
              {item.loading && (
                <Progress
                  trackColor="transparent"
                  size={25}
                  progressWidth={1.5}
                  loading
                />
              )}
              {item.icon && (
                <Icon name={item.icon} color={textColor} size={23} animate />
              )}
            </Flex>
          ) : null}
          <Flex
            flex={1}
            alignItems={item.confirm && !item.loading ? "center" : undefined}
          >
            {item.title && (
              <Text font="h4" color={textColor}>
                {item.title}
              </Text>
            )}

            {item.message && <Text color={textColor}>{item.message}</Text>}
            {item.component || null}
          </Flex>
        </Flex>
        {item.confirm && !item.loading && (
          <Flex w="100%" mt={theme.globals.gap} row>
            <Button
              flex={1}
              mr={theme.globals.gap / 2}
              bg="error"
              rounded
              light
              onPress={() => {
                show({ key: item.key, timeout: 0 });
                if (item.onCancel) item.onCancel();
              }}
            >
              {theme.translations.cancel}
            </Button>
            <Button
              flex={1}
              ml={theme.globals.gap / 2}
              rounded
              onPress={item.onConfirm ? () => item.onConfirm() : null}
            >
              {theme.translations.confirm}
            </Button>
          </Flex>
        )}

        {!item.confirm && (
          <Flex
            onPress={(e) => {
              e.stopPropagation();
              show({ key: item.key, timeout: 0 });
            }}
            as={TouchableOpacity}
            bg={item.type || "surface"}
            bgDarken={10}
            w={44}
            absolute
            t={10}
            r={10}
            b={10}
            maxHeight={38}
            borderRadius={5}
            flexCenter
          >
            <Icon name="x" color={textColor} size={20} />
          </Flex>
        )}
      </>
    );
  };

  return (
    <Container
      from={from}
      gap={gap}
      py={gap / 2 + offset}
      pointerEvents="box-none"
      {...rest}
    >
      {from === "top" ? <SafeAreaView collapsable={false} /> : null}
      {items.map((item, index) => {
        const { key, type, ...rest } = item;

        return (
          <Message
            ref={(ref) => ref && refMap.set(item, ref)}
            my={gap / 2}
            removeItem={() => {
              remove(key);
            }}
            key={`${key}`}
            timeout={item.timeout}
            itemKey={key}
            flexCenter
          >
            <Flex
              w="100%"
              borderRadius={theme.globals.roundness}
              maxWidth={maxWidth}
              bg={type || "surface"}
              p={theme.globals.gap}
              borderWidth={1}
              borderColor="text"
              borderColorAlpha={0.05}
              shadow={3}
              minHeight={50}
              justifyContent="center"
              {...messageProps}
              {...rest}
            >
              {renderMessage({ item })}
            </Flex>
          </Message>
        );
      })}
      {/* {from === "bottom" ? <SafeAreaView collapsable={false} /> : null} */}
    </Container>
  );
}, "Alert");
Alert.propTypes = {
  alert: PropTypes.object,
  timeout: PropTypes.number,
  from: PropTypes.string,
  gap: PropTypes.number,
  maxWidth: PropTypes.number,
  onAlert: PropTypes.func,
};

Alert.defaultPropTypes = {
  timeout: 2000,
  from: "top",
  gap: 15,
  maxWidth: 700,
};

export default Alert;
