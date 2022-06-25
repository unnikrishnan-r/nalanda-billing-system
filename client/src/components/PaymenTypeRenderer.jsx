import React,{Component} from "react";
export default class PaymentTypeRenderer extends Component {
    render() {
      return (
        <div>
            {
                 (this.props.data.paymentType==="0")
                 ? <label>Bill Payment</label>
                 :<label>Cash Advance</label>
            } 
        </div>
      )
    }
  }