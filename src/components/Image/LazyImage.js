import * as React from 'react';

import { withThemeProps } from '../../restyle';
import Image from './Image';

function LazyImage({
  source,
  thumbSource,
  width,
  height,
  blurRadius = 10,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const { bindVisibility } = useVisibilitySensor({
    stayVisible: true,
    onChange: (vis) => {
      setVisible(vis);
    },
  });
  const [imgLoading, setImgLoading] = useState(true);
  const [thumbLoading, setThumbLoading] = useState(true);

  return (
    <Flex relative {...bindVisibility}>
      {visible && (
        <Animate from={{ o: 0 }} to={{ o: thumbLoading ? 0 : 1 }}>
          <Image
            width={width}
            height={height}
            source={thumbSource || source}
            onLoad={() => setThumbLoading(false)}
            blurRadius={blurRadius}
            {...rest}
          />
        </Animate>
      )}
      {visible && (
        <Animate from={{ o: 0 }} to={{ o: imgLoading ? 0 : 1 }} absoluteFill>
          <Image
            width={width}
            height={height}
            source={source}
            onLoad={() => setImgLoading(false)}
            {...rest}
          />
        </Animate>
      )}
    </Flex>
  );
}

export default withThemeProps(LazyImage, 'LazyImage');

// import React, { useState, useEffect } from 'react';
// import { Image as Img, View } from 'react-native';

// import Flex from '../Flex';
// import Animate from '../Animate';
// import { useVisibilitySensor } from '../../hooks';

// const LazyImage = ({ style, source, thumbSource, blurRadius }) => {
//   const [visible, setVisible] = useState(false);
//   const { bindVisibility } = useVisibilitySensor({
//     stayVisible: true,
//     onChange: (vis) => {
//       setVisible(vis);
//     },
//   });
//   const [imgLoading, setImgLoading] = useState(true);
//   const [thumbLoading, setThumbLoading] = useState(true);

//   return (
//     <View {...bindVisibility}>
//       {visible && (
//         <Animate from={{ o: 0 }} to={{ o: thumbLoading ? 0 : 1 }} absoluteFill>
//           <Img
//             source={thumbSource || source}
//             onLoad={() => setThumbLoading(false)}
//             style={style}
//             blurRadius={blurRadius}
//           />
//         </Animate>
//       )}
//       {visible && (
//         <Animate from={{ o: 0 }} to={{ o: imgLoading ? 0 : 1 }} absoluteFill>
//           <Img
//             source={source}
//             onLoad={() => setImgLoading(false)}
//             style={style}
//           />
//         </Animate>
//       )}
//     </View>
//   );
// };

// export default function Image({
//   source,
//   width,
//   height,
//   blurRadius = 10,
//   style,
//   lazy = false,
//   ...rest
// }) {
//   const [imgWidth, setWidth] = useState(isNaN(width) ? 0 : width);
//   const [imgHeight, setHeight] = useState(isNaN(height) ? 0 : height);
//   const [aspect, setAspect] = useState(0);

//   useEffect(() => {
//     if (width && !height && !aspect) {
//       Img.getSize(source.uri, (w, h) => {
//         const aspectRatio = h / w;
//         setAspect(aspectRatio);
//         setHeight(imgWidth * aspectRatio);
//       });
//     } else if (width && !height && aspect) {
//       setHeight(imgWidth * aspect);
//     }
//   }, [imgWidth]);

//   useEffect(() => {
//     if (height && !width && !aspect) {
//       Img.getSize(source.uri, (w, h) => {
//         const aspectRatio = w / h;
//         setAspect(aspectRatio);
//         setWidth(imgHeight * aspectRatio);
//       });
//     } else if (height && !width && aspect) {
//       setWidth(imgHeight * aspect);
//     }
//   }, [imgHeight]);

//   return lazy ? (
//     <Flex
//       maxWidth="100%"
//       bg="surface"
//       onLayout={(e) => {
//         if (width) {
//           setWidth(e.nativeEvent.layout.width);
//         } else if (height) {
//           setHeight(e.nativeEvent.layout.height);
//         }
//       }}
//       relative
//       style={{
//         width: width || imgWidth,
//         height: height || imgHeight || 100,
//         ...style,
//       }}
//       {...rest}
//     >
//       <LazyImage
//         source={source}
//         blurRadius={blurRadius}
//         style={{
//           width: typeof width === 'string' ? '100%' : width || imgWidth,
//           height: height || imgHeight || 100,
//         }}
//         {...rest}
//       />
//     </Flex>
//   ) : (
//     <Img
//       key={}
//       onLayout={(e) => {
//         if (width) {
//           setWidth(e.nativeEvent.layout.width);
//         } else if (height) {
//           setHeight(e.nativeEvent.layout.height);
//         }
//       }}
//       source={source}
//       style={{
//         width: width || imgWidth,
//         height: height || imgHeight || 100,
//       }}
//     />
//   );
// }
