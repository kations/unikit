import * as React from 'react';
import { withThemeProps } from '../../style';

import Animate from '../Animate';

import Flex from '../Flex';
import Draggable from '../Draggable';

import Toast from './Toast';
import ActionSheet from './ActionSheet';

import { useInterval } from '../../hooks';

const POSITIONS = {
  top: { alignSelf: 'flex-start', from: { y: -100, opacity: 0 } },
  center: { alignSelf: 'center', from: { y: 100, opacity: 0 } },
  bottom: { alignSelf: 'flex-end', from: { y: 100, opacity: 0 } },
};

const Alert = React.forwardRef(
  (
    {
      component = 'Toast',
      theme,
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
    const [wait, setWait] = React.useState(false);
    const [visible, setVisible] = React.useState(true);

    const close = () => {
      setVisible(false);
    };

    console.log({ timeout, wait });

    useInterval(close, !timeout || wait ? undefined : timeout);

    const positionProps = POSITIONS[position];

    console.log({ component, visible });

    return (
      <Draggable
        direction="y"
        maxY={position === 'top' ? 10 : undefined}
        minY={position !== 'top' ? -10 : undefined}
        snapTo={
          position === 'top' ? [{ top: 0, offset: -70 }] : [{ bottom: 0 }]
        }
        onDragStart={() => setWait(true)}
        onDragStop={() => setWait(false)}
        onSnap={(index) => {
          if (index === 0) {
            removeItem(item.key);
          }
        }}
        snapToStart
      >
        <Animate
          to={{ y: 0, opacity: 1 }}
          visible={visible}
          duration={750}
          w="100%"
          flexCenter
          onMouseOver={() => setWait(true)}
          onMouseLeave={() => setWait(false)}
          onDidAnimate={(ani) => {
            if (ani.state === 'exit') {
              removeItem(item.key);
            }
          }}
          pointerEvents="box-none"
          py={theme.spacing.s / 2}
          {...positionProps}
        >
          <Flex ref={ref} w="100%" maxWidth={maxWidth} pointerEvents="box-none">
            {component === 'Toast' ? (
              <Toast close={close} {...rest} {...item} />
            ) : null}
            {component === 'ActionSheet' ? (
              <ActionSheet close={close} {...rest} {...item} />
            ) : null}
          </Flex>
        </Animate>
      </Draggable>
    );
  }
);

export default withThemeProps(Alert, 'Alert');
