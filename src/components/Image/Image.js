import * as React from 'react';
import { Image as RNImage } from 'react-native';
import { withThemeProps, styled } from '../../style';
import { useLayout } from '../../hooks';
const Img = styled.Image();

function Image({ source, width, height, style = {}, ...rest }) {
  const layout = useLayout();
  const [aspect, setAspect] = React.useState(1);

  React.useEffect(() => {
    RNImage.getSize(source.uri || source, (w, h) => {
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
