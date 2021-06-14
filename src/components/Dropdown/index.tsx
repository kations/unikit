import * as React from 'react';

import { styled, withThemeProps } from '../../style';
import { useUpdateEffect } from '../../hooks';

import Overlay from '../Overlay';
import Flex from '../Flex';

const Touchable = styled.Pressable();

const POSITIONS = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

interface Props {
  theme: object;
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'left' | 'center' | 'right';
  backdrop?: boolean;
  isOpen?: boolean;
  [key: string]: any;
}

const Dropdown = ({
  theme,
  children,
  position = 'center',
  content = null,
  backdrop = true,
  isOpen = false,
  ...rest
}: Props) => {
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(isOpen);
  const [measure, setMeasure] = React.useState(null);

  useUpdateEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <>
      <Touchable
        ref={ref}
        onPress={() => {
          ref.current.measure((a, b, w, h, px, py) => {
            setMeasure({ a, b, w, h, px, py });
            console.log({ a, b, w, h, px, py });
            setTimeout(() => setOpen(!open), 10);
          });
        }}
      >
        {children}
      </Touchable>
      <Overlay
        visible={open}
        x={measure?.px}
        y={measure?.py + measure?.h}
        onClose={() => setOpen(false)}
        position="top"
        paddingVertical={10}
        scroll={false}
        backdrop={backdrop}
        closeButton={false}
        renderHeader={
          backdrop ? (
            <Flex l={measure?.px} t={measure?.py} fixed>
              <Touchable
                onPress={() => {
                  setOpen(false);
                }}
              >
                {children}
              </Touchable>
            </Flex>
          ) : null
        }
        modalProps={{
          width: measure?.w,
          alignItems: POSITIONS[position],
        }}
        {...rest}
      >
        {content instanceof Function
          ? content({ close: () => setOpen(false) })
          : content}
      </Overlay>
    </>
  );
};

export default withThemeProps(Dropdown, 'Dropdown');
