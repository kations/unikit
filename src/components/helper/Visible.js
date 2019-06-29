import React, { Component } from "react";
import { View, Dimensions } from "react-native";

export default class Visible extends Component {
  constructor(props) {
    super(props);
    this.state = { rectTop: 0, rectBottom: 0, isVisible: false };
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.startWatching();
    }
  }

  componentWillUnmount() {
    this.stopWatching();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.stopWatching();
    } else {
      this.lastValue = null;
      this.startWatching();
    }
  }

  startWatching = () => {
    const { offset } = this.props;
    if (this.interval) {
      return;
    }
    this.interval = setInterval(() => {
      if (!this.myview) {
        return;
      }
      this.myview.measure((x, y, width, height, pageX, pageY) => {
        this.setState({
          rectTop: pageY + offset,
          rectBottom: pageY + height + offset,
          rectWidth: pageX + width
        });
      });
      this.isInViewPort();
    }, this.props.delay || 100);
  };

  stopWatching() {
    this.interval = clearInterval(this.interval);
  }

  isInViewPort() {
    const window = Dimensions.get("window");
    const isVisible =
      this.state.rectBottom != 0 &&
      this.state.rectTop >= 0 &&
      this.state.rectBottom <= window.height;
    if (this.lastValue !== isVisible) {
      this.lastValue = isVisible;
      this.setState({ isVisible: isVisible });
      this.props.onChange(isVisible);
    }
  }

  render() {
    return (
      <View
        collapsable={false}
        ref={component => {
          this.myview = component;
        }}
        {...this.props}
      >
        {this.props.children instanceof Function
          ? this.props.children({
              isVisible: this.state.isVisible
            })
          : this.props.children}
      </View>
    );
  }
}
