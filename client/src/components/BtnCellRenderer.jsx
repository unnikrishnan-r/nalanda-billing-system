import React, { Component } from "react";
export default class BtnCellRenderer extends Component {
  constructor(props) {
    super(props);
    this.btnClickedHandler = this.btnClickedHandler.bind(this);
  }
  btnClickedHandler() {
    this.props.clicked(this.props.value);
  }
  render() {
    return (
      <div className="toggle">
        <div className="custom-control custom-switch">
          <input type="checkbox"
            className="custom-control-input"
            id="toggleSwitches"
            checked={this.props.data.customerStatus}  />
            <label className="custom-control-label"
            id="toggleSwitches">
            {this.props.data.customerStatus ?" Active" : "Inactive"}</label>
        </div>
      </div>
    )
  }
}