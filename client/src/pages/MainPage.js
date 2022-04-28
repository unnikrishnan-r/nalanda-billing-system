import React, { Component } from "react";
import { withRouter } from "react-router-dom";
// import "./style.css"
import Navbar from "../components/Navbar"

class MainPage extends Component {
  render() {
    return (
      <>
      <Navbar></Navbar>
      </>
    );
  }
}

export default withRouter(MainPage);
