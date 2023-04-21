import React,{Component} from "react";
export default class LedgerTypeRenderer extends Component {
    render() {
      return (
        <div>
            {
                 (this.props.data.paymentType==="0")
                 ? <label>Debit</label>
                 :<label>Credit</label>
            } 
        </div>
      )
    }
  }