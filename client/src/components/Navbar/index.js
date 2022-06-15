import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
export class index extends Component {
  render() {
    return (
      <Navbar bg="light" variant="light">
        <Navbar.Brand href="/">Nalanda Associates</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Customers</Nav.Link>
          <Nav.Link href="/latexCollection">Latex Collection</Nav.Link>
          <Nav.Link href="/cashpayment">Cash Payments</Nav.Link>
          <Nav.Link href="/billingInvoices">Billing & Invoices</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}
export default withRouter(index);