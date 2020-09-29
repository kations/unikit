import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Image as Img, Platform } from "react-native";

import styled from "../styled";
import Box from "../Box";
import Visible from "../Visible";
import { useSpring, AnimatedView } from "../Spring";

const ImageWrap = styled(Box)({
  backgroundColor: "surface",
  maxWidth: "100%",
});

const Animate = styled(AnimatedView)({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const LazyImage = ({ style, source, thumbSource, blurRadius }) => {
  const [imgLoading, setImgLoading] = useState(true);
  const [thumbLoading, setThumbLoading] = useState(true);

  const imgO = useSpring({
    to: imgLoading ? 0 : 1,
  });
  const thumbO = useSpring({
    to: thumbLoading ? 0 : 1,
  });

  return (
    <Visible stayVisible offset={100}>
      {({ isVisible }) =>
        isVisible ? (
          <Fragment>
            <Animate style={{ opacity: thumbO }}>
              <Img
                source={thumbSource || source}
                onLoad={() => setThumbLoading(false)}
                style={style}
                blurRadius={blurRadius}
              />
            </Animate>
            <Animate
              onLoad={() => setImgLoading(false)}
              style={{ opacity: imgO }}
            >
              <Img
                source={source}
                onLoad={() => setImgLoading(false)}
                style={style}
              />
            </Animate>
          </Fragment>
        ) : null
      }
    </Visible>
  );
};

export default function Image({
  source,
  width,
  height,
  blurRadius = 10,
  style,
  lazy = false,
  ...rest
}) {
  const [imgWidth, setWidth] = useState(isNaN(width) ? 0 : width);
  const [imgHeight, setHeight] = useState(isNaN(height) ? 0 : height);
  const [aspect, setAspect] = useState(0);

  useEffect(() => {
    if (width && !height && !aspect) {
      Img.getSize(source.uri, (w, h) => {
        const aspectRatio = h / w;
        setAspect(aspectRatio);
        setHeight(imgWidth * aspectRatio);
      });
    } else if (width && !height && aspect) {
      setHeight(imgWidth * aspect);
    }
  }, [imgWidth]);

  useEffect(() => {
    if (height && !width && !aspect) {
      Img.getSize(source.uri, (w, h) => {
        const aspectRatio = w / h;
        setAspect(aspectRatio);
        setWidth(imgHeight * aspectRatio);
      });
    } else if (height && !width && aspect) {
      setWidth(imgHeight * aspect);
    }
  }, [imgHeight]);

  return lazy ? (
    <ImageWrap
      onLayout={(e) => {
        if (width) {
          setWidth(e.nativeEvent.layout.width);
        } else if (height) {
          setHeight(e.nativeEvent.layout.height);
        }
      }}
      style={{
        width: width || imgWidth,
        height: height || imgHeight || 100,
        ...style,
      }}
      {...rest}
    >
      <LazyImage
        source={source}
        blurRadius={blurRadius}
        style={{
          width: width || imgWidth,
          height: height || imgHeight || 100,
        }}
        {...rest}
      />
    </ImageWrap>
  ) : (
    <Img
      onLayout={(e) => {
        if (width) {
          setWidth(e.nativeEvent.layout.width);
        } else if (height) {
          setHeight(e.nativeEvent.layout.height);
        }
      }}
      source={source}
      style={{
        width: width || imgWidth,
        height: height || imgHeight || 100,
      }}
    />
  );
}
