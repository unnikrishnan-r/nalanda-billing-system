import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./style.css";
export class index extends Component {
  render() {
    return (
      <Navbar bg="light" variant="light">
        <Navbar.Brand id="title" href="/">
          Nalanda Associates
        </Navbar.Brand>
        <Nav className="me-auto">
          <Link className="mr-3" id="customer" to="/">
            Customers
          </Link>
          <Link className="mr-3" id="latex" to="/latexCollection">
            Latex Collection
          </Link>
          <Link className="mr-3" id="cash" to="/cashPayment">
            Cash Payments
          </Link>
          <Link className="mr-3" id="bill" to="/billingInvoices">
            Billing & Invoices
          </Link>
        </Nav>
      </Navbar>
    );
  }
}
export default withRouter(index);
