import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import "ag-grid-enterprise";
// import "./style.css"
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
import API from "../utils/API";

class MainPage extends Component {
  state = {
    customerList: [],
    rowdata: [
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 },
    ],
    columnDefs: [
      { field: "customerId", filter: "agSetColumnFilter" },
      { field: "customerName", filter: "agSetColumnFilter" },
      { field: "customerAddress", filter: "agSetColumnFilter" },
      { field: "customerPhone", filter: "agSetColumnFilter" },
      { field: "customerBalance", filter: "agSetColumnFilter" }
    ],
  };

  componentDidMount = () => {
    this.loadCustomers();
  };

  loadCustomers = () => {
    API.getCustomerList()
      .then((res) => {
        console.log(res);
        this.setState({ customerList: res.data });
        // console.log(this.state.customerList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <br></br>
        <Container></Container>
        <div className="ag-theme-alpine" style={{ height:500 }}>
          <AgGridReact
            rowData={this.state.customerList}
            columnDefs={this.state.columnDefs}
          ></AgGridReact>
        </div>
      </>
    );
  }
}

export default withRouter(MainPage);
