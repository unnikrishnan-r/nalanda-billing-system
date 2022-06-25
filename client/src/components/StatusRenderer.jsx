import React, { Component } from "react";
import "./style.css";
export default class StatusRenderer extends Component {
  render() {
    return (
      <div>
        {
          (this.props.data.paymentStatus)
            ? <label>
              <span className="dotPaid"></span><label id="status">Bill Ready</label>
              </label>
            : <label>
              <span className="dotUnPaid"></span><label id="status">Bill Pending</label>
              </label>
        }
      </div>
    )
  }
}