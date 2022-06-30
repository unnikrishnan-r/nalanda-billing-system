import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import printJS from "print-js";
import { PDFDocument } from "pdf-lib";

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
  Spinner,
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
function formatNumber(number) {
  return Number(number)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function currencyFormatter(params) {
  return "Rs." + formatNumber(params.value);
}
function digitFormatter(params) {
  return Number(params.value).toFixed(2);
}
function digitFormatterInvoice(params) {
  return Number(params).toFixed(2);
}
function currencyFormatterInvoice(params) {
  return "Rs." + formatNumber(params);
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
        valueFormatter: digitFormatter,
      },
      {
        field: "unitRatePerKg",
        filter: "agSetColumnFilter",
        headerName: "Unit Rate/Kg",
        floatingFilter: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: "totalBillAmount",
        filter: "agSetColumnFilter",
        headerName: "Total Bill Amount",
        floatingFilter: true,
        valueFormatter: currencyFormatter,
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
    generatedInvoices: [],
    gettingInvoices: false,
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
              generatedInvoices: res.data,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  handlePrintClick = (event) => {
    console.log("Trying to print");
    console.log(this.state.generatedInvoices);
    this.setState({ gettingInvoices: true });
    API.uploadInvoicesToAws({ files: this.state.generatedInvoices }).then(
      (res) => {
        mergeAllPDFs(res.data).then((result) =>
          this.setState({ gettingInvoices: false })
        );
      }
    );
  };
  componentDidMount = () => {
    API.getBillingHistory()
      .then((res) => {
        console.log(res);
        this.setState({ billHistory: res.data, gettingInvoices: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    let numberOfCustomers = "Number of Customers:\t\t";
    let totalNetWeight = "Total Net Weight:\t\t\t\t";
    let totalDryWeight = "Total Dry Weight:\t\t\t\t";
    let ratePerKg = "Rate/Kg:\t\t\t\t\t\t";
    let totaInvoiceAmount = "Total Invoice Amount:\t\t\t";

    return (
      <>
        <Navbar></Navbar>
        <br></br>

        <div id="pagetitle">
          <h3>Billing And Invoices</h3>
        </div>
        <br></br>
        <Container>
          <div id="Box">
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
                  <div id="amtbox">
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
                          id="FromDatebill" // PropTypes.string.isRequired,
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
                          id="ToDateBill" // PropTypes.string.isRequired,
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
                        id="subBtn2"
                        variant="info"
                        type="submit"
                        className="btn btn-success submit-button calc-button"
                        disabled={!this.state.showBillSummary}
                        onClick={() => this.handlePrintClick()}
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
                        Print Invoices
                      </Button>{" "}
                    </div>
                  </div>
                </div>

                {this.state.showBillSummary ? (
                  <div>
                    <br></br>
                    <br></br>
                    <Card className="invoiceCard">
                      <Card.Header id="card">
                        <h2>Invoice Amount</h2>
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
                            digitFormatterInvoice(
                              this.state.BillSummaryRecord.totaldryWeight
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {ratePerKg +
                            currencyFormatterInvoice(
                              this.state.BillSummaryRecord.unitRatePerKg
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {totaInvoiceAmount +
                            currencyFormatterInvoice(
                              this.state.BillSummaryRecord.totalBillAmount
                            )}
                        </ListGroup.Item>
                      </ListGroup>
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
