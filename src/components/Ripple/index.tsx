import * as React from 'react';

import Animate from '../Animate';
import { styled, withThemeProps } from '../../style';

const Touchable = styled.Touchable();

const Rip = React.forwardRef(
  ({ timeout, remove, itemKey, size, ...rest }, ref) => {
    return (
      <Animate
        ref={ref}
        w={size}
        h={size}
        borderRadius={size / 2}
        from={{ scale: 0.5, opacity: 1 }}
        to={{ scale: 2, opacity: 0 }}
        onDidAnimate={() => {
          remove(itemKey);
        }}
        duration={500}
        absolute
        {...rest}
      />
    );
  }
);

interface Props {
  theme: object;
  children: React.ReactNode;
  size?: number;
  color?: string;
  overflow?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

function Ripple({
  children,
  onPress,
  size = 50,
  rippleColor = 'text',
  overflow = false,
  disabled = false,
  ...rest
}: Props) {
  const [refMap] = React.useState(() => new WeakMap());
  const [items, setItems] = React.useState([]);

  const remove = (key) => {
    setItems((state) => state.filter((a) => a.key !== key));
  };

  return (
    <Touchable
      onPress={(e) => {
        if (disabled !== true) {
          let { locationX, layerX, locationY, layerY } = e.nativeEvent;
          console.log({ locationX, layerX, locationY, layerY });
          if (onPress) onPress();
          setItems((state) => [
            ...state,
            {
              key: new Date().getTime(),
              x: locationX || layerX,
              y: locationY || layerY,
            },
          ]);
        }
      }}
      {...rest}
      overflow={!overflow ? 'hidden' : undefined}
      pointerEvents="box-only"
      relative
    >
      {children}
      {items.map((item) => (
        <Animate
          bg={rippleColor}
          ref={(ref) => ref && refMap.set(item, ref)}
          key={`ripple-${item.key}`}
          w={size}
          h={size}
          l={item ? item.x - size / 2 : 0}
          t={item ? item.y - size / 2 : 0}
          zIndex={9999}
          borderRadius={size / 2}
          from={{ scale: 0.5, opacity: 0.75 }}
          to={{ scale: 2, opacity: 0 }}
          onDidAnimate={() => {
            remove(item.key);
          }}
          pointerEvents="none"
          absolute
        />
      ))}
    </Touchable>
  );
}

export default withThemeProps(Ripple, 'Ripple');
