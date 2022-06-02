import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";

import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Dropdown,
  Jumbotron,
  Modal,
  Table,
} from "react-bootstrap";
import Navbar from "../components/Navbar";
import NewCashPaymentForm from "../components/NewCashPaymentForm";
import API from "../utils/API";

class CashPayments extends Component {
  state = {
    addCashPaymentFormTrigger: true,
  };

  showCashPaymentForm = () => {
    this.setState({
      addCashPaymentFormTrigger: true,
    });
  };
  closeCashPaymentForm = () => {
    this.setState({
      addCashPaymentFormTrigger: false,
    });
    // this.componentDidMount();
  };

  render() {
    {
      console.log("test cash page");
    }
    return (
      <>
        <Navbar></Navbar>
        <NewCashPaymentForm
          trigger={this.state.addCashPaymentFormTrigger}
          closeCashPaymentForm={this.closeCashPaymentForm}
        ></NewCashPaymentForm>
      </>
    );
  }
}
export default withRouter(CashPayments);
