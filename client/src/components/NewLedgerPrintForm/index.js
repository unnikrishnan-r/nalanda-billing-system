import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import printJS from "print-js";
import { PDFDocument } from "pdf-lib";

import moment from "moment";
import API from "../../utils/API";
const animatedComponent = makeAnimated();

async function mergeAllPDFs(urls) {
  console.log(urls);
  const pdfDoc = await PDFDocument.create();
  const numDocs = urls.length;
  const donorPdfBytes = await fetch(urls).then((res) => res.arrayBuffer());
  const donorPdfDoc = await PDFDocument.load(donorPdfBytes);
  const docLength = donorPdfDoc.getPageCount();
  for (var k = 0; k < docLength; k++) {
    const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
    pdfDoc.addPage(donorPage);
  }

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

  // strip off the first part to the first comma "data:image/png;base64,iVBORw0K..."
  var data_pdf = pdfDataUri.substring(pdfDataUri.indexOf(",") + 1);
  printJS({ printable: data_pdf, type: "pdf", base64: true, showModal: true });
}

class NewLedgerPrintForm extends Component {
  state = {
    selectedUsers: [],
    validated: false,
    generatedLedger: "",
    ledgerFromEntryDate: moment(),
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

  handleOnSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
    } else {
      this.setState({ validated: true });
      const newLedgerPrintEntry = {
        customerId: this.state.selectedUsers.value,
        ledgerFromEntryDate: moment(this.state.ledgerFromEntryDate)
          .add({
            hours: moment().format("h"),
            minutes: moment().format("m"),
            seconds: moment().format("s"),
          })
          .format("MM/DD/YYYY HH:mm:ss"),
      };
      API.generateLedgerStatement(newLedgerPrintEntry)
        .then((res) => {
          this.setState({
            validated: false,
            generatedLedger: res.data,
          });
          API.uploadLedgerToAws({ file: res.data }).then((res) => {
            mergeAllPDFs(res.data).then((result) =>
              this.setState({ gettingLedger: false })
            );
          });
              // this.props.closeLedgerPrintEntryForm();
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
          <h4 style={{ fontWeight: "bold" }}>New Ledger Request</h4>
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
                <Form.Label>From Date</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="date"
                placeholder="DD/MM/YYYY"
                name="ledgerFromEntryDate"
                onChange={this.handleInputChange}
                value={this.state.ledgerFromEntryDate}
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
              onClick={() => this.props.closeLedgerPrintEntryForm()}
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

export default withRouter(NewLedgerPrintForm);
