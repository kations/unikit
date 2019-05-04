import React from "react";
import { StyleSheet, Animated, Image } from "react-native-web";
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
      height: props.height,
      aspect: null
    };
  }

  getSize = () => {
    Image.getSize(this.props.source.uri, (width, height) =>
      this.setState({ aspect: width / height }, () => {
        this.setSize();
      })
    );
  };

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1
    }).start();
    this.getSize();
  };

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1
    }).start();
    this.getSize();
    if (this.props.onImageLoad) this.props.onImageLoad();
  };

  setSize = () => {
    const width = !this.props.width ? this.state.layoutWidth : this.props.width;
    const height = !this.props.height
      ? this.state.layoutWidth / this.state.aspect
      : this.props.height;
    this.setState({
      width,
      height
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

    return (
      <Box
        onLayout={({ nativeEvent }) => {
          this.setState(
            {
              layoutWidth: nativeEvent.layout.width
            },
            () => {
              this.setSize();
            }
          );
        }}
        style={style}
        {...rest}
        width={full ? "100%" : this.state.width || "100%"}
        height={this.state.height || "auto"}
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
              height: this.state.height || "auto"
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
              height: this.state.height || "auto"
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
