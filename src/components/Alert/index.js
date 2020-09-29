import * as React from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import color from 'tinycolor2';

import { withThemeProps, useTheme } from '../../restyle';

import Touchable from '../Touchable';
import Animate from '../AnimateNative';
import Flex from '../Flex';

import { isNumber, isDark, isWeb, isFunction } from '../../utils';
import { useInterval } from '../../hooks';

import alertRef from './ref';
import Alert from './Alert';
import Buttons from './Buttons';
import ActionSheet from './ActionSheet';

const POSITIONS = {
  top: { alignSelf: 'flex-start', from: { y: -100, o: 0 } },
  center: { alignSelf: 'center', from: { y: 100, o: 0 } },
  bottom: { alignSelf: 'flex-end', from: { y: 100, o: 0 } },
};

const Message = React.forwardRef(
  (
    {
      timeout,
      removeItem,
      itemKey,
      maxWidth,
      item,
      position = 'top',
      setBackdrop,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const [visible, setVisible] = React.useState(true);
    const [counter, setCounter] = React.useState(timeout || 1000);
    const [wait, setWait] = React.useState(false);
    const interval = 259;

    useInterval(
      () => {
        setCounter((c) => (c > 0 ? c - interval : 0));
      },
      wait || !timeout ? undefined : interval
    );

    const close = () => {
      setVisible(false);
      if (item.backdrop) setBackdrop(false);
      setTimeout(() => {
        removeItem();
      }, 500);
    };

    React.useEffect(() => {
      if (counter === 0) {
        close();
      }
    }, [counter]);

    React.useEffect(() => {
      setCounter(timeout);
    }, [timeout]);

    const textColor = isDark(theme.colors[item.type || 'surface'])
      ? '#FFF'
      : color(theme.colors[item.type || 'primary']).toString();

    const positionProps = POSITIONS[position];

    const defaultProps = {
      close,
      itemKey,
      textColor,
      buttonSize: 55,
      ...item,
    };

    return (
      <Animate
        to={{ y: 0, o: 1 }}
        w="100%"
        isVisible={visible}
        flexCenter
        onMouseOver={() => setWait(true)}
        onMouseLeave={() => setWait(false)}
        pointerEvents="box-none"
        {...positionProps}
      >
        <Flex
          ref={ref}
          w="100%"
          position="relative"
          borderRadius={theme.globals.roundness}
          maxWidth={maxWidth}
          bg={item.type || 'surface'}
          shadow={5}
          minHeight={50}
          justifyContent="center"
          pointerEvents="box-none"
          {...rest}
        >
          <Flex
            w="100%"
            borderRadius={theme.globals.roundness}
            overflow="hidden"
          >
            <Alert interval={interval} counter={counter} {...defaultProps} />
            <ActionSheet {...defaultProps} />
            {isFunction(item.component)
              ? item.component()
              : item.component || null}
            <Buttons {...defaultProps} />
          </Flex>
        </Flex>
      </Animate>
    );
  }
);

const AlertWrap = ({
  timeout = 2000,
  from = 'top',
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
  }, [items]);

  const edit = (key) => {
    setItems((state) => state.filter((a) => a.key !== key));
  };

  const remove = (key) => {
    setItems((state) => state.filter((a) => a.key !== key));
  };

  const show = (alert) => {
    const newAlertId = new Date().getTime();

    setItems((state) => {
      if (alert.key) {
        const newState = state.map((a) => {
          if (a.key === alert.key) return { ...a, ...alert };
          return { ...a };
        });
        return newState;
      } else {
        if (alert.backdrop !== undefined && alert.backdrop !== backdrop) {
          setBackdrop(alert.backdrop);
        } else if (backdrop === true) {
          setBackdrop(false);
        }
        const alertTimeout =
          alert.timeout === false || alert.confirm || alert.actionSheet
            ? undefined
            : isNumber(alert.timeout)
            ? alert.timeout
            : timeout;
        alert.timeout = alertTimeout;
        if (alert.position === 'bottom' || alert.position === 'center') {
          return [
            ...state,
            { key: newAlertId, position: alert.position || 'top', ...alert },
          ];
        } else {
          return [
            { key: newAlertId, position: alert.position || 'top', ...alert },
            ...state,
          ];
        }
      }
    });

    if (onAlert) onAlert(alert);
    if (onFeedback) onFeedback(alert.type);

    return newAlertId;
  };

  React.useImperativeHandle(alertRef, () => ({
    show,
    remove,
    edit,
  }));

  const renderItem = (item) => {
    const { key, position = 'top', ...rest } = item;

    return (
      <Message
        ref={(ref) => ref && refMap.set(item, ref)}
        my={gap / 2}
        removeItem={() => {
          remove(key);
        }}
        timeout={item.timeout}
        item={rest}
        position={position}
        maxWidth={maxWidth}
        flexCenter
        show={show}
        setBackdrop={setBackdrop}
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
      height={theme.height}
      width="100%"
      p={gap}
      zIndex={9999}
      position={isWeb ? 'fixed' : 'absolute'}
      top={0}
      left={0}
      right={0}
      bottom={0}
      justifyContent="space-between"
      {...rest}
    >
      <Animate
        from={{ o: 0 }}
        to={{ o: 1 }}
        height={theme.height}
        absoluteFill
        bg="rgba(0,0,0,0.25)"
        isVisible={backdrop && items.length > 0}
        pointerEvents={backdrop && items.length > 0 ? 'all' : 'none'}
        webStyle={{
          backfaceVisibility: 'hidden',
          backdropFilter: 'blur(1px)',
        }}
      >
        <Touchable
          height={theme.height}
          absoluteFill
          onPress={() => setItems([])}
        />
      </Animate>

      <Flex w="100%" pointerEvents="box-none">
        <SafeAreaView collapsable={false} />
        {items
          .filter((i) => i.position === 'top')
          .map((item) => renderItem(item))}
      </Flex>
      <Flex w="100%" pointerEvents="box-none">
        {items
          .filter((i) => i.position === 'center')
          .map((item) => renderItem(item))}
      </Flex>
      <Flex w="100%" pointerEvents="box-none">
        {items
          .filter((i) => i.position === 'bottom')
          .map((item) => renderItem(item))}
        <SafeAreaView collapsable={false} />
      </Flex>
    </Flex>
  );
};

export default withThemeProps(AlertWrap, 'AlertWrap');
