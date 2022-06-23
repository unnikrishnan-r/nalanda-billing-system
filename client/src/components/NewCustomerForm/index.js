import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../../utils/API";

class NewCustomerForm extends Component {
  state = {
    validated: false,
    customerName: null,
    customerAddress: null,
    customerPhoneNumber: null,
    customerEmailId: null,
    customerStatus: true,
  };
  // Handles updating component state when the user types into the input field
  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    console.log("Submited");
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
    } else {
      this.setState({ validated: true });
      const newCustomer = {
        customerName: this.state.customerName,
        customerAddress: this.state.customerAddress,
        customerPhone: this.state.customerPhoneNumber,
        customerEmail: this.state.customerEmailId,
        customerStatus: this.state.customerStatus,
      };
      console.log(newCustomer);
      API.createCustomer(newCustomer)
        .then((res) => {
          console.log(res);
          this.setState({
            validated: false,
            customerName: null,
            customerAddress: null,
            customerPhoneNumber: null,
            customerEmailId: null,
            customerStatus: true,
          });
          this.props.closeAddCustomerForm();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  render() {
    return this.props.trigger ? (
      <div className="newCustomer">
        <div className="newCustomerInner">
          <h4 style={{ fontWeight: "bold"}}>New Customer</h4>
          <hr size="" width="" color="grey"/>  
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleOnSubmit}
          >
            <Form.Group>
              <div className="titleText">
                <Form.Label>Customer Name</Form.Label><span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="text"
                placeholder="Enter new customer name..."
                name="customerName"
                onChange={this.handleInputChange}
                value={this.state.customerName}
                maxLength={50}
                required
              />
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Address</Form.Label><span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="text"
                placeholder="Enter new customer's address..."
                name="customerAddress"
                onChange={this.handleInputChange}
                value={this.state.customerAddress}
                required
              />
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Phone</Form.Label><span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="number"
                placeholder="Enter new customer's phone number..."
                name="customerPhoneNumber"
                onChange={this.handleInputChange}
                value={this.state.customerPhoneNumber}
                maxLength={10}
                required
              />
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Customer's Email</Form.Label>
              </div>
              <Form.Control
                type="text"
                placeholder="Enter new customer's email address..."
                name="customerEmailId"
                onChange={this.handleInputChange}
                value={this.state.customerEmailId}
              />
            </Form.Group>
            <hr size="" width="" color="grey"/>  
            <Button
              id="subBtn"
              variant="info"
              type="submit"
              className="btn btn-success submit-button"
              onClick={() => this.props.submitAddCustomerForm()}
            >
              Submit
            </Button>
            <Button
              id="subBtn"
              variant="info"
              className="btn btn-light cancel-button"
              onClick={() => this.props.closeAddCustomerForm()}
            >
              Cancel
            </Button>
          </Form>
        </div>
      </div>
    ) : (
      ""
    );
  }
}

export default withRouter(NewCustomerForm);
