import React from 'react';
import PropTypes from 'prop-types';

const checkBoxLabelClass = 'component-checkbox-label';
const checkBoxClass = 'component-checkbox';

export default class CheckBox extends React.Component {

  static get propTypes() {
    return {
      text: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };

    this._onCheckChange = this._onCheckChange.bind(this);
  }

  get checked() {
    return this.state.checked;
  }

  _onCheckChange(e) {
    this.setState({
      checked: e.target.checked
    });
  }

  render() {
    const text = this.props.text;
    const onChange = this._onCheckChange;
    return (
      <label className={checkBoxLabelClass} >
        <input
          className={checkBoxClass}
          type='checkbox'
          onChange={onChange}
        />
        {"  " + text}
      </label>
    );
  }

}
