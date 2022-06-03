import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
export class index extends Component {
  render() {
    return (
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="/">Nalanda Latex Management System!!!</Navbar.Brand>
        <Nav className="mr-auto">
          <Link className="mr-3" style={{ color: "black" }} to="/">
            Customers
          </Link>
          <Link className="mr-3" style={{ color: "black" }} to="/latexCollection">
            Latex Collection
          </Link>
          <Link className="mr-3" style={{ color: "black" }} to="/cashPayments">
            Cash Payments
          </Link>
          <Link className="mr-3" style={{ color: "black" }} to="/billingInvoices">
            Billing & Invoices
          </Link>
        </Nav>
      </Navbar>
    );
  }
}
export default withRouter(index);
