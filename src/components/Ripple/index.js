import * as React from 'react';

import Animate from '../AnimateNative';
import Touchable from '../Touchable';

const Ripple = React.forwardRef(
  ({ timeout, remove, itemKey, size, ...rest }, ref) => {
    React.useEffect(() => {
      setTimeout(() => {
        remove(itemKey);
      }, timeout);
    }, []);

    return (
      <Animate
        ref={ref}
        w={size}
        h={size}
        borderRadius={size / 2}
        from={{ s: 0.5, o: 1 }}
        to={{ s: 2, o: 0 }}
        isVisible={true}
        duration={500}
        absolute
        {...rest}
      />
    );
  }
);

export default function Button({
  children,
  onPress,
  size = 50,
  color = 'text',
  overflow = false,
  disabled = false,
  ...rest
}) {
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
      activeOpacity={1}
      pointerEvents="box-only"
      relative
    >
      {children}
      {items.map((item) => (
        <Ripple
          ref={(ref) => ref && refMap.set(item, ref)}
          key={`ripple-${item.key}`}
          itemKey={item.key}
          size={size}
          timeout={5000}
          bg={`${color}:setAlpha:0.2`}
          remove={remove}
          style={{
            left: item ? item.x - size / 2 : 0,
            top: item ? item.y - size / 2 : 0,
          }}
          pointerEvents="none"
        />
      ))}
    </Touchable>
  );
}
