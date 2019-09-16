import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring/native";

import styled from "../styled";
import Box from "../Box";
import Visible from "../Visible";

const ImageWrap = styled(Box)({
  backgroundColor: "surface",
  maxWidth: "100%"
});

const Img = styled.Image({
  backgroundColor: "surface"
});

const Animate = animated(
  styled.View({ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 })
);

export default function Image({
  source,
  thumbSource,
  width,
  height,
  blurRadius = 10,
  style,
  lazy = false,
  ...rest
}) {
  const [imgLoading, setImgLoading] = useState(true);
  const [thumbLoading, setThumbLoading] = useState(true);
  const [imgHeight, setHeight] = useState(height || 0);
  const [imgWidth, setWidth] = useState(width || 0);

  useEffect(() => {
    Img.getSize(source.uri, (w, h) => {
      console.log({ w, h, imgHeight, imgWidth, height: h * (imgWidth / h) });
      if (!height) {
        setHeight(h * (imgWidth / w));
      }
    });
  }, [imgWidth]);

  useEffect(() => {
    Img.getSize(source.uri, (w, h) => {
      console.log({ w, h, imgHeight, imgWidth, height: h * (imgWidth / h) });
      if (!width) {
        setWidth(w * (imgHeight / h));
      }
    });
  }, [imgHeight]);

  const imgProps = useSpring({
    opacity: imgLoading ? 0 : 1,
    config: { duration: 250 }
  });
  const thumbProps = useSpring({
    opacity: thumbLoading ? 0 : 1,
    config: { duration: 250 }
  });

  const renderImages = () => {
    return (
      <Fragment>
        <Animate style={{ opacity: thumbProps.opacity }}>
          <Img
            source={thumbSource || source}
            onLoad={() => setThumbLoading(false)}
            style={{
              width: width || imgWidth,
              height: height || imgHeight
            }}
            blurRadius={blurRadius}
          />
        </Animate>
        <Animate style={{ opacity: imgProps.opacity }}>
          <Img
            source={source}
            onLoad={() => setImgLoading(false)}
            style={{
              width: width || imgWidth,
              height: height || imgHeight
            }}
          />
        </Animate>
      </Fragment>
    );
  };

  return (
    <ImageWrap
      onLayout={e => {
        if (width && !height) {
          setWidth(e.nativeEvent.layout.width);
        } else if (!width && height) {
          setHeight(e.nativeEvent.layout.height);
        }
      }}
      style={{
        width: width || imgWidth,
        height: height || imgHeight,
        ...style
      }}
      {...rest}
    >
      {lazy ? (
        <Visible stayVisible offset={100}>
          {({ isVisible }) =>
            isVisible ? (
              <Fragment>
                <Animate style={{ opacity: thumbProps.opacity }}>
                  <Img
                    source={thumbSource || source}
                    onLoad={() => setThumbLoading(false)}
                    style={{
                      width: width || imgWidth,
                      height: height || imgHeight
                    }}
                    blurRadius={blurRadius}
                  />
                </Animate>
                <Animate style={{ opacity: imgProps.opacity }}>
                  <Img
                    source={source}
                    onLoad={() => setImgLoading(false)}
                    style={{
                      width: width || imgWidth,
                      height: height || imgHeight
                    }}
                  />
                </Animate>
              </Fragment>
            ) : null
          }
        </Visible>
      ) : (
        <Img
          source={source}
          onLoad={() => setImgLoading(false)}
          style={{
            width: width || imgWidth,
            height: height || imgHeight
          }}
        />
      )}
    </ImageWrap>
  );
}
