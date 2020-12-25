import * as React from 'react';

import { withThemeProps, styled } from '../../restyle';
import { useLayout } from '../../hooks';
import { isAndroid } from '../../utils';
const Img = styled.Image();

function Image({ source, width, height, style = {}, ...rest }) {
  const layout = useLayout();
  const [aspect, setAspect] = React.useState(1);

  React.useEffect(() => {
    Img.getSize(source.uri || source, (w, h) => {
      const aspectRatio = h / w;
      setAspect(aspectRatio);
    });
  }, [source]);

  return (
    <Img
      onLayout={layout.onLayout}
      source={source}
      style={{
        ...style,
        width: width ? width : layout.height / aspect,
        height: height ? height : layout.width * aspect,
      }}
      {...rest}
    />
  );
}

export default withThemeProps(Image, 'Image');
