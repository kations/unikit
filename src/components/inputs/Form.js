import React from "react";
import { rgba } from "polished";
import { withTheme } from "../../style/Theme";

import Slider from "./Slider";
import Input from "./Input";
import Select from "./Select";
import Images from "./Images";
import DatePicker from "./Date";

const Inputs = {
  Select,
  Input,
  Slider,
  Images,
  DatePicker
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    let data = {};
    Object.keys(props.schema).map(key => {
      let input = props.schema[key];
      if (input.defaultValue) {
        data[key] = input.defaultValue;
      } else {
        data[key] = undefined;
      }
    });
    if (props.initSchema) {
      data = Object.assign({}, data, props.initialData);
    }
    this.state = {
      data: data,
      errors: {}
    };
  }

  getInput = (key, input) => {
    var Component = Inputs[input.ui] || Input;

    return (
      <Component
        {...input}
        value={this.state.data[key]}
        onChange={value => this.setData(key, value)}
      />
    );
  };

  setData = (key, value) => {
    this.setState({
      data: {
        ...this.state.data,
        [key]: value
      }
    });
    if (this.props.onChange) {
      this.props.onChange(key, value);
    }
  };

  validate = (schema, data) => {
    var errors = {};
    Object.keys(schema).map(key => {
      let input = schema[key];
      if (input.required && !data[key]) {
        errors[key] = "Required";
      }
    });
    return errors;
  };

  submit = callback => {
    var errors = this.validate(this.props.schema, this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length > 0) {
      var message = `${
        this.props.schema[Object.keys(errors)[0]].label
      } is required`;
      alert(message);
      throw new Error(message);
    } else if (this.props.onSubmit) {
      this.props.onSubmit(this.state.data);
      if (callback) {
        callback(this.state.data);
      }
    }
  };

  render() {
    const { schema, style, onSubmit, theme } = this.props;

    const { avatar, background, text } = defaultStyle(props, theme);

    return (
      <Form style={style}>
        {Object.keys(schema).map((key, index) => {
          let input = schema[key];
          return (
            <InputWrap key={`input-${index}`}>
              {input.label ? (
                <Label error={this.state.errors[key]}>{input.label}</Label>
              ) : null}
              {this.getInput(key, input)}
            </InputWrap>
          );
        })}
      </Form>
    );
  }
}

const defaultStyle = (props, theme) =>
  StyleSheet.create({
    form: {
      position: "relative",
      width: "100%"
    },
    wrap: {
      position: "relative",
      width: "100%"
    },
    label: {
      fontSize: 12,
      color: "rgba(0,0,0,0.5)",
      paddingTop: 10,
      paddingBottom: 6
    }
  });

export default withTheme(Form);
