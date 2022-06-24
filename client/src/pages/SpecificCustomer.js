import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";
import StatusRenderer from "../components/StatusRenderer";

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
class SpecificCustomer extends Component {
    render() {
        return (
          <>
            <Navbar></Navbar>
            <Container>
                <div className="customerDetails">

                </div>
                <div className="twoBox">
                    <div className="contact">

                    </div>
                    <div className="collectionStatus">

                    </div>
                </div>
                <div className="latexCollection">


                </div>
                <div className="cashPayment">

                </div>
            </Container>
          </>
        );
      }
        

}
export default withRouter(SpecificCustomer);