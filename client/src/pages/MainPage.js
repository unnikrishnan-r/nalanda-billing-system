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

class MainPage extends Component {
  state = {
    rowdata: [
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 },
    ],
    columnDefs: [
      { field: "make", filter: "agSetColumnFilter" },
      { field: "model", filter: "agSetColumnFilter" },
      { field: "price", filter: "agSetColumnFilter" },
    ],
  };
  render() {
    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <br></br>
        <Container></Container>
        <div className="ag-theme-alpine" style={{ height: 400, width: 1000 }}>
          <AgGridReact
            rowData={this.state.rowdata}
            columnDefs={this.state.columnDefs}
          ></AgGridReact>
        </div>
      </>
    );
  }
}

export default withRouter(MainPage);
