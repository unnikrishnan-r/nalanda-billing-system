import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
export default class index extends Component {
  render() {
    return (
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">Nalanda Latex Management System!!!</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Customers</Nav.Link>
          <Nav.Link href="#features">Latex Collection</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}
