import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";

import Navbar from "../components/Navbar";
import { Tabs, Tab, Container, Card, Form, Button } from "react-bootstrap";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

import moment from "moment";
import API from "../utils/API";

class BillingInvoices extends Component {
  state = {
    focusedBillFrom: false,
    focusedBillTo: false,

    billFromDate: moment(),
    billToDate: moment(),
    ratePerKg: "",
  };
  onBillFromDateChange = (date) => {
    this.setState({ billFromDate: moment(date) });
  };
  onBillToDateChange = (date) => {
    this.setState({ billToDate: moment(date) });
  };
  // Handles updating component state when the user types into the input field
  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
    console.log(value);
  };
  calculateInvoice() {
    console.log(this.state);
    API.calculateInvoiceAmount({
      billFromDate: this.state.billFromDate,
      billToDate: this.state.billToDate,
      unitRatePerKg: parseInt(this.state.ratePerKg),
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <br></br>
        <br></br>
        <Container>
          <div>
            <Tabs
              defaultActiveKey="calcInvoice"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="calcInvoice" title="Calculate Invoice Amount">
                <div className="grid-container">
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label>From Date</Form.Label>
                      </div>
                    </Form.Group>

                    <SingleDatePicker
                      date={moment(this.state.billFromDate)} // momentPropTypes.momentObj or null
                      onDateChange={this.onBillFromDateChange}
                      focused={this.state.focusedBillFrom} // PropTypes.bool
                      onFocusChange={({ focused }) =>
                        this.setState({ focusedBillFrom: focused })
                      }
                      id="billFromDate" // PropTypes.string.isRequired,
                    />
                  </div>
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label>To Date</Form.Label>
                      </div>
                    </Form.Group>

                    <SingleDatePicker
                      date={moment(this.state.billToDate)} // momentPropTypes.momentObj or null
                      onDateChange={this.onBillToDateChange}
                      focused={this.state.focusedBillTo} // PropTypes.bool
                      onFocusChange={({ focused }) =>
                        this.setState({ focusedBillTo: focused })
                      }
                      id="billToDate" // PropTypes.string.isRequired,
                    />
                  </div>
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label>Average Rate</Form.Label>
                      </div>

                      <Form.Control
                        type="number"
                        placeholder="Enter the rate per kg"
                        name="ratePerKg"
                        onChange={this.handleInputChange}
                        value={this.state.ratePerKg}
                        maxLength={10}
                        required
                      />
                    </Form.Group>
                  </div>
                  <Button
                    id="subBtn"
                    variant="info"
                    type="submit"
                    className="btn btn-success submit-button"
                    onClick={() => this.calculateInvoice()}
                  >
                    Calculate Invoice Amount
                  </Button>
                </div>
              </Tab>
              <Tab eventKey="invoiceHistory" title="Billing & Invoice History">
                {" "}
                <h1> Tab 2</h1>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </>
    );
  }
}
export default withRouter(BillingInvoices);
