import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";

import Navbar from "../components/Navbar";
import { Tabs, Tab, Container, Card, Form } from "react-bootstrap";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

import moment from "moment";
import API from "../utils/API";

class BillingInvoices extends Component {
  state = {
    focusedCheckIn: "",
  };
  onCheckInChange = (date) => {
    console.log(date);
  };
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
                <div>
                  <SingleDatePicker
                    date={moment()} // momentPropTypes.momentObj or null
                    onDateChange={(date) => this.onCheckInChange}
                    focused={false} // PropTypes.bool
                    onFocusChange={({ focused }) =>
                      this.setState({ focusedCheckIn: focused })
                    }
                    id="your_unique_id" // PropTypes.string.isRequired,
                  />
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
