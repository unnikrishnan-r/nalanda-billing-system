import React,{Component} from "react";
export default class StatusRenderer extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <label>{this.props.data.paymentStatus ? "Paid" : "Unpaid"}</label>
      )
    }
  }