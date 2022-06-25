import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import printJS from "print-js";
import { PDFDocument, StandardFonts, rgb, PDFLib } from "pdf-lib";

import "./style.css";

import Navbar from "../components/Navbar";
import {
  Tabs,
  Tab,
  Container,
  Card,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

import moment from "moment";
import API from "../utils/API";

async function mergeAllPDFs(urls) {
  console.log(urls);
  //https://stackoverflow.com/questions/21478738/how-can-we-do-pdf-merging-using-javascript
  const pdfDoc = await PDFDocument.create();
  const numDocs = urls.length;

  for (var i = 0; i < numDocs; i++) {
    const donorPdfBytes = await fetch(urls[i]).then((res) => res.arrayBuffer());
    const donorPdfDoc = await PDFDocument.load(donorPdfBytes);
    const docLength = donorPdfDoc.getPageCount();
    for (var k = 0; k < docLength; k++) {
      const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
      //console.log("Doc " + i+ ", page " + k);
      pdfDoc.addPage(donorPage);
    }
  }

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

  // strip off the first part to the first comma "data:image/png;base64,iVBORw0K..."
  var data_pdf = pdfDataUri.substring(pdfDataUri.indexOf(",") + 1);
  printJS({ printable: data_pdf, type: "pdf", base64: true, showModal: true });
  console.log("Printing Merged PDF");
}

class BillingInvoices extends Component {
  state = {
    columnDefs: [
      {
        field: "billFromDate",
        filter: "agSetColumnFilter",
        headerName: "Bill From Date",
        floatingFilter: true,
        cellRenderer: (data) => {
          return moment.utc(data.data.billFromDate).format("DD/MM/YYYY");
        },
      },
      {
        field: "billToDate",
        filter: "agSetColumnFilter",
        headerName: "Bill To Date",
        floatingFilter: true,
        cellRenderer: (data) => {
          return moment.utc(data.data.billToDate).format("DD/MM/YYYY");
        },
      },
      {
        field: "numberOfBills",
        filter: "agSetColumnFilter",
        headerName: "Number of Bills",
        floatingFilter: true,
      },
      {
        field: "totalNetWeight",
        filter: "agSetColumnFilter",
        headerName: "Total Net Weight",
        floatingFilter: true,
      },
      {
        field: "totaldryWeight",
        filter: "agSetColumnFilter",
        headerName: "Total Dry Weight",
        floatingFilter: true,
      },
      {
        field: "unitRatePerKg",
        filter: "agSetColumnFilter",
        headerName: "Unit Rate/Kg",
        floatingFilter: true,
      },
      {
        field: "totalBillAmount",
        filter: "agSetColumnFilter",
        headerName: "Total Bill Amount",
        floatingFilter: true,
      },
    ],
    defaultColDef: {
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      flex: 1,
    },
    focusedBillFrom: false,
    focusedBillTo: false,

    billFromDate: moment(),
    billToDate: moment(),
    ratePerKg: 0,
    showBillSummary: false,
  };
  onBillFromDateChange = (date) => {
    this.setState({ billFromDate: moment(date).format("MM/DD/YYYY") });
  };
  onBillToDateChange = (date) => {
    this.setState({ billToDate: moment(date).format("MM/DD/YYYY") });
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
    })
      .then((res) => {
        console.log(res.data);
        let billSummaryObj = res.data;
        API.generateInvoices({
          billFromDate: this.state.billFromDate,
          billToDate: this.state.billToDate,
        })
          .then((res) => {
            console.log(res.data);
            this.setState({
              BillSummaryRecord: billSummaryObj,
              showBillSummary: true,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  handlePrintClick = (event) => {
    console.log("Trying to print");
    const fileName =
      "https://nalandainvoices.s3.ap-south-1.amazonaws.com/68_02072022.pdf";
    let urls = [];
    for (let i = 0; i < 50; i++) {
      urls.push(fileName);
    }
    let combinedPdf = mergeAllPDFs(urls);
  };
  componentDidMount = () => {
    API.getBillingHistory()
      .then((res) => {
        console.log(res);
        this.setState({ billHistory: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    let numberOfCustomers = "Number of Customers:";
    let totalNetWeight = "Total Net Weight:";
    let totalDryWeight = "Total Dry Weight:";
    let ratePerKg = "Rate/Kg:";
    let totaInvoiceAmount = "Total Invoice Amount:";

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
              className="mb-3 billingTabs"
            >
              <Tab
                className="innerTab"
                eventKey="calcInvoice"
                title="Calculate Invoice Amount"
              >
                <div className="grid-container">
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label>From Date</Form.Label>
                      </div>

                      <SingleDatePicker
                        date={moment(this.state.billFromDate)} // momentPropTypes.momentObj or null
                        onDateChange={this.onBillFromDateChange}
                        focused={this.state.focusedBillFrom} // PropTypes.bool
                        isOutsideRange={() => false}
                        onFocusChange={({ focused }) =>
                          this.setState({ focusedBillFrom: focused })
                        }
                        id="billFromDate" // PropTypes.string.isRequired,
                      />
                    </Form.Group>
                  </div>
                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label>To Date</Form.Label>
                      </div>

                      <SingleDatePicker
                        date={moment(this.state.billToDate)} // momentPropTypes.momentObj or null
                        onDateChange={this.onBillToDateChange}
                        focused={this.state.focusedBillTo} // PropTypes.bool
                        isOutsideRange={() => false}
                        onFocusChange={({ focused }) =>
                          this.setState({ focusedBillTo: focused })
                        }
                        id="billToDate" // PropTypes.string.isRequired,
                      />
                    </Form.Group>
                  </div>

                  <div className="grid-child purple">
                    <Form.Group>
                      <div className="titleText">
                        <Form.Label className="titleText"></Form.Label>
                      </div>
                      <Button
                        id="subBtn1"
                        variant="info"
                        type="submit"
                        className="btn btn-success submit-button calc-button"
                        onClick={() => this.calculateInvoice()}
                      >
                        Calculate Invoice Amount
                      </Button>{" "}
                    </Form.Group>
                    <Button
                      id="subBtn1"
                      variant="info"
                      type="submit"
                      className="btn btn-success submit-button calc-button"
                      disabled={!this.state.showBillSummary}
                      onClick={() => this.handlePrintClick()}
                    >
                      Print Invoices
                    </Button>{" "}
                  </div>
                </div>

                {this.state.showBillSummary ? (
                  <div>
                    <br></br>
                    <br></br>
                    <Card className="invoiceCard" style={{ width: "36rem" }}>
                      <Card.Header>
                        <h2>Invoice Summary</h2>
                      </Card.Header>
                      <ListGroup variant="flush" style={{ whiteSpace: "pre" }}>
                        <ListGroup.Item>
                          {numberOfCustomers +
                            this.state.BillSummaryRecord.numberOfBills}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {totalNetWeight +
                            this.state.BillSummaryRecord.totalNetWeight}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {totalDryWeight +
                            this.state.BillSummaryRecord.totaldryWeight}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {ratePerKg +
                            this.state.BillSummaryRecord.unitRatePerKg}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {totaInvoiceAmount +
                            this.state.BillSummaryRecord.totalBillAmount}
                        </ListGroup.Item>
                      </ListGroup>
                      <Button variant="primary">
                        Generate & Print Invoices
                      </Button>
                    </Card>
                  </div>
                ) : (
                  ""
                )}
              </Tab>
              <Tab
                className="innerTab"
                eventKey="invoiceHistory"
                title="Billing & Invoice History"
              >
                <div
                  className="ag-theme-alpine grid-box"
                  style={{ height: 500 }}
                >
                  <AgGridReact
                    rowData={this.state.billHistory}
                    columnDefs={this.state.columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    paginationAutoPageSize={true}
                    pagination={true}
                  ></AgGridReact>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </>
    );
  }
}
export default withRouter(BillingInvoices);
