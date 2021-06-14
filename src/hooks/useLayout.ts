import * as React from 'react';
import { LayoutChangeEvent } from 'react-native';

type Layout = { width: number; height: number; x: number; y: number };
type OnLayout = (event: LayoutChangeEvent) => void;

export default function useLayout(): Layout & { onLayout: OnLayout } {
  const [layout, setLayout] = React.useState<Layout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onLayout = React.useCallback((e) => {
    const l = e.nativeEvent.layout || {};
    setLayout((s) => ({ ...s, ...l }));
  }, []);

  return {
    onLayout,
    ...layout,
  };
}
