import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./style.css";
export class index extends Component {
  render() {
    return (
      <Navbar bg="light" variant="light">
        <Navbar.Brand id="title" href="/">Nalanda Associates</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link id="customer" href="/">Customers</Nav.Link>
          <Nav.Link id ="latex" href="/latexCollection">Latex Collection</Nav.Link>
          <Nav.Link id ="cash" href="/cashpayment">Cash Payments</Nav.Link>
          <Nav.Link id="bill" href="/billingInvoices">Billing & Invoices</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}
export default withRouter(index);