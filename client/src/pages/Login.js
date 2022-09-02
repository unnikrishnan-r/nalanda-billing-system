import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import API from "../utils/API";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./css/login.css";
import Card from "react-bootstrap/Card";
import Nav from "../components/Navbar";
import "web-animations-js/web-animations-next.min.js";
import moment from "moment";
require("dotenv").config();

const loginDivStyle = {
  float: "right",
  marginRight: "10%",
  boxShadow: "0px 0px 40px #b3b3b3",
  marginTop: "5%",
};

class Login extends Component {
  state = {
    username: "",
    password: "",
    validateLogin: false,
  };

  componentDidMount() {
    sessionStorage.removeItem("UserId");
    var elementDiv = document.getElementById("loginDiv");
    var animation = elementDiv.animate(
      {
        opacity: [0.2, 0.4, 0.6, 0.8, 1],
        transform: [
          "scale(0.2)",
          "scale(0.4)",
          "scale(0.6)",
          "scale(0.8)",
          "scale(1)",
        ],
      },
      {
        duration: 1000,
      }
    );
  }

  validateFormCompletion = () => {
    return !(this.state.username && this.state.password);
  };
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };
  handleFormSubmit = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      API.checkLogin(this.state)
        .then((res) => {
          sessionStorage.setItem("UserId", res.data.id);
          console.log("going to redirect");

          var emailData = {
            service_id: process.env.REACT_APP_EMAILJS_SERVICEID,
            template_id: process.env.REACT_APP_EMAILJS_TEMPATEID,
            user_id: process.env.REACT_APP_EMAILJS_USERID,
            template_params: {
              from_name: res.data.username,
              timestamp: moment().format("ddd MMMM Do, YYYY HH:mm:ss"),
              message: "",
            },
          };
          API.sendEmail(emailData)
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
          this.props.history.push("/customer");
        })
        .catch((err) => {
          this.setState({
            username: "",
            password: "",
            validateLogin: true,
          });
        });
    }
  };

  handleloginclose = () => {
    this.setState({
      validateLogin: false,
    });
  };

  render() {
    return (
      <>
        <Nav></Nav>
        <Container
          fluid
          style={{
            height: "100vh",
          }}
          id="main"
        >
          <br></br>
          <div
            className="col-lg-4 col-md-6 col-sm-6"
            id="loginDiv"
            style={loginDivStyle}
          >
            <div className="loginModal">
              <h3
                style={{
                  lineHeight: "auto",
                  // color: "#7fff00",
                  borderBottomLength: "50px",
                  borderBottom: "1px solid #222",
                  textAlign: "center",
                  paddingTop: "20px",
                }}
              >
                LOGIN
              </h3>
            </div>
            <Card.Body style={{ paddingTop: "40px" }}>
              <Row>
                <Col md={12} sm={12}>
                  <Form>
                    <Form.Control
                      value={this.state.username}
                      onChange={this.handleInputChange}
                      name="username"
                      id="uname"
                      placeholder="Enter your username"
                    />
                    <br></br>
                    <Form.Control
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      name="password"
                      id="passwd"
                      type="password"
                      placeholder="Enter your password"
                    />
                    <br></br>

                    <div className="text-center">
                      <Button
                        className="btn btn-info "
                        id="buttonSubmit"
                        disabled={this.validateFormCompletion()}
                        onClick={this.handleFormSubmit}
                      >
                        Log In
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </div>

          {/* Invalid Login Modal Handler */}
          <Modal
            show={this.state.validateLogin}
            onHide={this.handleloginclose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <Modal.Title id="contained-modal-title-center">
                <span style={{ color: "red" }}>Invalid Login</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button onClick={this.handleloginclose}>OK</Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </>
    );
  }
}

export default withRouter(Login);
