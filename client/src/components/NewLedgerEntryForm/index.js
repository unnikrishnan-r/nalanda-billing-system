import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";

import moment from "moment";
import API from "../../utils/API";
const animatedComponent = makeAnimated();

class NewLedgerEntryForm extends Component {
  state = {
    selectedUsers: [],
    validated: false,
    ledgerEntryDate: moment(),
    totalAmount: null,
    paymentType: 1,
    paymentName: "Credit",
    paymentNotes: "Credit Entry",
  };
  onChange = (selectedUsers) => {
    this.setState({
      selectedUsers: selectedUsers || [],
    });
  };

  // Handles updating component state when the user types into the input field
  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  //Common function to handle dropdown selections - Occupancy and Locations
  handleDropDownSelection = (eventKey, event) => {
    this.setState({
      paymentName: eventKey,
      paymentNotes: event.target.id === "1" ? "Credit Entry" : "Debit Entry",
      paymentType: event.target.id === "1" ? 1 : 0,
    });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
    } else {
      this.setState({ validated: true });
      const newLedgerEntry = {
        customerId: this.state.selectedUsers.value,
        ledgerEntryDate: moment(this.state.ledgerEntryDate)
          .add({
            hours: moment().format("h"),
            minutes: moment().format("m"),
            seconds: moment().format("s"),
          })
          .format("MM/DD/YYYY HH:mm:ss"),
        totalAmount: this.state.totalAmount,
        paymentType: this.state.paymentType,
        paymentNotes: this.state.paymentNotes,
      };
      API.createLedgerEntry(newLedgerEntry)
        .then((res) => {
          this.setState({
            // selectedUsers: [],
            validated: false,
            // paymentDate: moment(),
            totalAmount: null,
            // paymentType: 1,
            // paymentName: "Cash Advance",
            // paymentNotes: "Advance Paid",
          });
          this.props.closeLedgerEntryForm();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    return this.props.trigger ? (
      <div className="newCashPayment">
        {" "}
        <div className="newCashPaymentInner">
          <h4 style={{ fontWeight: "bold" }}>New Ledger entry</h4>
          <hr size="" width="" color="grey" />
          <br></br>
          <h6 style={{ fontWeight: "normal", display: "inline" }}>
            Customer Name
          </h6>
          <span id="mandatory"> * </span>
          <AsyncSelect
            components={animatedComponent}
            value={this.state.selectedUsers}
            placeholder={"Search using customer name..."}
            loadOptions={API.searchLedgerCustomer}
            onChange={this.onChange}
          />
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleOnSubmit}
          >
            <br></br>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Payment Date</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="date"
                placeholder="DD/MM/YYYY"
                name="ledgerEntryDate"
                onChange={this.handleInputChange}
                value={this.state.ledgerEntryDate}
                required
              />
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Payment Type</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Dropdown>
                <Dropdown.Toggle variant="info" id="dropdown-basic">
                  {this.state.paymentName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    id="1"
                    name="paymentType"
                    eventKey="Credit"
                    onSelect={this.handleDropDownSelection}
                  >
                    Credit
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="2"
                    name="paymentType"
                    eventKey="Debit"
                    onSelect={this.handleDropDownSelection}
                  >
                    Debit
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Amount</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="number"
                placeholder="Enter the amount..."
                name="totalAmount"
                onChange={this.handleInputChange}
                value={this.state.totalAmount}
                maxLength={10}
                required
              />
            </Form.Group>
            <Form.Group>
              <div className="titleText">
                <Form.Label>Notes</Form.Label>
              </div>
              <Form.Control
                type="text"
                placeholder="Enter notes if any..."
                name="paymentNotes"
                onChange={this.handleInputChange}
                value={this.state.paymentNotes}
                required
              />
            </Form.Group>
            <hr size="" width="" color="grey" />
            <Button
              id="subBtn"
              variant="info"
              type="submit"
              className="btn btn-success submit-button"
            >
              Submit
            </Button>
            <Button
              id="subBtn"
              variant="info"
              className="btn btn-light cancel-button"
              onClick={() => this.props.closeLedgerEntryForm()}
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

export default withRouter(NewLedgerEntryForm);
