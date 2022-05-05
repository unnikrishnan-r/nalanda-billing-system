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
    // rowdata: [
    //   { make: "Toyota", model: "Celica", price: 35000 },
    //   { make: "Ford", model: "Mondeo", price: 32000 },
    //   { make: "Porsche", model: "Boxster", price: 72000 },
    // ],
    columnDefs: [
      {
        field: "customerId",
        filter: "agSetColumnFilter",
        headerName: "Customer Id",
        floatingFilter:true
      },
      {
        field: "customerName",
        filter: "agSetColumnFilter",
        headerName: "Customer Name",
        editable: true,
        floatingFilter:true
      },
      {
        field: "customerAddress",
        filter: "agSetColumnFilter",
        headerName: "Address",
        editable: true,
        floatingFilter:true
      },
      {
        field: "customerPhone",
        filter: "agSetColumnFilter",
        headerName: "Phone",
        editable: true,
        floatingFilter:true
      },
      {
        field: "customerBalance",
        filter: "agSetColumnFilter",
        headerName: "Net Due Amount",
        floatingFilter:true
      },
      {
        field: "customerStatus",
        filter: "agSetColumnFilter",
        headerName: "Customer Status",
        floatingFilter:true
      },

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
        <div className="ag-theme-alpine" style={{ height: 500 }}>
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
