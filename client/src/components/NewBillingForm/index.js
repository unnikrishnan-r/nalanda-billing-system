import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import API from "../../utils/API";
import moment from "moment";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import printJS from "print-js";
import { PDFDocument } from "pdf-lib";

const animatedComponent = makeAnimated();
async function mergeAllPDFs(urls) {
  //https://stackoverflow.com/questions/21478738/how-can-we-do-pdf-merging-using-javascript
  const pdfDoc = await PDFDocument.create();
  const numDocs = urls.length;

  for (var i = 0; i < numDocs; i++) {
    const donorPdfBytes = await fetch(urls[i]).then((res) => res.arrayBuffer());
    const donorPdfDoc = await PDFDocument.load(donorPdfBytes);
    const docLength = donorPdfDoc.getPageCount();
    for (var k = 0; k < docLength; k++) {
      const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
      pdfDoc.addPage(donorPage);
    }
  }

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

  // strip off the first part to the first comma "data:image/png;base64,iVBORw0K..."
  var data_pdf = pdfDataUri.substring(pdfDataUri.indexOf(",") + 1);
  printJS({ printable: data_pdf, type: "pdf", base64: true, showModal: true });
}
class NewBillingForm extends Component {
  state = {
    selectedUsers: [],
    generatedInvoices: [],
    gettingInvoices: false,
    validated: false,
    fromBillDate: moment(),
    toBillDate: moment(),
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
      const newBilllRequest = {
        customerId: this.state.selectedUsers.value,
        billFromDate: moment.utc(this.state.fromBillDate).format("MM/DD/YYYY"),
        billToDate: moment.utc(this.state.toBillDate).format("MM/DD/YYYY"),
      };
      console.log(newBilllRequest);
      this.setState({ gettingInvoices: true });
      API.calculateInvoiceAmount(newBilllRequest).then((res) => {
        let billSummaryObj = res.data;
        API.generateInvoices(newBilllRequest)
          .then((res) => {
            console.log(res.data);
            this.setState({
              generatedInvoices: res.data,
            });
            API.uploadInvoicesToAws({
              files: this.state.generatedInvoices,
            }).then((res) => {
              mergeAllPDFs(res.data).then((result) => {
                this.setState({
                  gettingInvoices: false,
                  selectedUsers: [],
                  generatedInvoices: [],
                  fromBillDate: moment(),
                  toBillDate: moment(),
                });
                this.props.closeNewBillingForm();
              });
            });
          })
          .catch((err) => console.log(err));
      });
    }
  };

  render() {
    return this.props.trigger ? (
      <div className="newBill">
        {" "}
        <div className="newBillInner">
          <h4 style={{ fontWeight: "bold" }}>Bill Generation</h4>
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
            loadOptions={API.loadOptions}
            onChange={this.onChange}
          />

          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleOnSubmit}
          >
            <Form.Group>
              <div className="titleText">
                <Form.Label>From Date</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="date"
                placeholder="DD/MM/YYYY"
                name="fromBillDate"
                onChange={this.handleInputChange}
                value={this.state.fromBillDate}
                required
              />
            </Form.Group>

            <Form.Group>
              <div className="titleText">
                <Form.Label>To Date</Form.Label>
                <span id="mandatory"> * </span>
              </div>
              <Form.Control
                type="date"
                placeholder="DD/MM/YYYY"
                name="toBillDate"
                onChange={this.handleInputChange}
                value={this.state.toBillDate}
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
              {this.state.gettingInvoices ? (
                <Spinner
                  as="span"
                  animation="grow"
                  role="status"
                  aria-hidden="true"
                  variant="success"
                />
              ) : (
                ""
              )}
              Submit
            </Button>
            <Button
              id="subBtn"
              variant="info"
              className="btn btn-light cancel-button"
              onClick={() => this.props.closeNewBillingForm()}
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
export default withRouter(NewBillingForm);
