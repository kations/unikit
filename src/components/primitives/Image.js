import React from "react";
import { StyleSheet, Animated, Image } from "react-native";
import Box from "./Box";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
});

const calcMax = (size, maxWidth) => {};

class Comp extends React.Component {
  thumbnailAnimated = new Animated.Value(0);
  imageAnimated = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: undefined,
      aspect: 0
    };
  }

  getSize = () => {
    Image.getSize(this.props.source.uri, (width, height) => {
      console.log({ aspect: height / width });
      var aspect = height / width;
      var height = this.state.width * aspect;
      this.setState({ aspect, height });
    });
  };

  handleThumbnailLoad = () => {
    console.log("loaded");
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1
    }).start();
    if (typeof this.state.width === "number") {
      this.getSize();
    }
  };

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1
    }).start();
    if (this.props.onImageLoad) this.props.onImageLoad();
  };

  setSize = () => {
    const width = this.props.width ? this.props.width : this.state.layoutWidth;
    const height = this.props.height
      ? this.props.height
      : this.state.layoutWidth / this.state.aspect;
    this.setState({
      width: width,
      height: height || 10
    });
  };

  render() {
    const {
      thumbnailSource,
      source,
      style,
      blurred,
      width,
      height,
      full,
      resizeMode,
      blurRadius,
      ...rest
    } = this.props;

    const imageHeight = height ? height : this.state.height || 100;

    console.log(this.state, imageHeight);

    return (
      <Box
        onLayout={({ nativeEvent }) => {
          this.setState({
            width: nativeEvent.layout.width
          });
        }}
        style={style}
        {...rest}
        width={width || "100%"}
        height={imageHeight}
      >
        <Animated.Image
          {...rest}
          source={thumbnailSource || source}
          resizeMode={resizeMode}
          blurRadius={blurRadius || 5}
          style={[
            style,
            {
              opacity: this.thumbnailAnimated,
              width: "100%",
              height: imageHeight
            }
          ]}
          onLoad={this.handleThumbnailLoad}
        />
        <Animated.Image
          {...rest}
          source={source}
          resizeMode={resizeMode}
          blurRadius={blurRadius || 0}
          style={[
            styles.imageOverlay,
            {
              opacity: this.imageAnimated,
              width: "100%",
              height: imageHeight
            },
            style
          ]}
          onLoad={this.onImageLoad}
        />
      </Box>
    );
  }
}

Comp.propTypes = {
  onImageLoad: PropTypes.func
};

export default Comp;
