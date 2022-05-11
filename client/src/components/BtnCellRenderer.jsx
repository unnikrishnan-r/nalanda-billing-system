import React,{Component} from "react";
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
        <label className="switch">
        <input type="checkbox"/>
          <span className="slider round"></span>
      </label>
      )
    }
  }