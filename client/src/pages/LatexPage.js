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
import NewCustomerForm from "../components/NewCustomerForm";
import API from "../utils/API";

class LatexPage extends Component {
  state = {
    addCustomerFormTrigger: false,

  };
  
  render() {
    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <br></br>
        <Container></Container>
        <br></br>
        <button>Add Latex</button>
        <br></br>
        <br></br>
      </>
    );
  }
}
export default withRouter(LatexPage);
