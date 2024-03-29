import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import printJS from "print-js";
import { PDFDocument } from "pdf-lib";

import moment from "moment";
import "./style.css";
import StatusRenderer from "../components/StatusRenderer";

import { Container, ListGroup,  Spinner} from "react-bootstrap";
import Navbar from "../components/Navbar";
import PaymentTypeRenderer from "../components/PaymenTypeRenderer";
import API from "../utils/API";
function formatNumber(number) {
  return Number(number)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function currencyFormatter(params) {
  return "Rs." + formatNumber(params.value);
}
function currencyFormatterCollection(params) {
  return "Rs." + formatNumber(params);
}
function customerStatus(params) {
  if (params) {
    return "Active";
  } else return "Inactive";
}

function digitFormatter(params) {
  return Number(params.value).toFixed(2);
}
function checkEmail(params) {
  if (params != null) {
    return params;
  } else {
    return "";
  }
}

async function mergeAllPDFs(urls) {
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

var dateFilterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = moment.utc(cellValue).format("DD/MM/YYYY");
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split("/");
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,
  minValidYear: 2022,
  buttons: ["clear"],
};
var defaultFilterParams = {
  buttons: ["clear"],
};
class SpecificCustomer extends Component {
  state = {
    customerList: [],
    gettingInvoices: false,
    latexColumnDefs: [
      {
        field: "collectionDate",
        filter: "agDateColumnFilter",
        filterParams: dateFilterParams,
        headerName: "Collection Date",
        floatingFilter: true,

        cellRenderer: (data) => {
          return moment.utc(data.data.collectionDate).format("DD/MM/YYYY");
        },
      },
      {
        field: "grossWeight",
        filter: "agSetColumnFilter",
        headerName: "Gross Weight",
        filterParams: defaultFilterParams,
        floatingFilter: true,
      },
      {
        field: "tareWeight",
        filter: "agSetColumnFilter",
        headerName: "Barrel Weight",
        filterParams: defaultFilterParams,
        floatingFilter: true,
      },
      {
        field: "netWeight",
        filter: "agSetColumnFilter",
        headerName: "Net Weight",
        filterParams: defaultFilterParams,
        floatingFilter: true,
      },
      {
        field: "drcPercent",
        filter: "agSetColumnFilter",
        headerName: "DRC %",
        floatingFilter: true,
        filterParams: defaultFilterParams,
        valueFormatter: digitFormatter,
      },
      {
        field: "dryWeight",
        filter: "agSetColumnFilter",
        headerName: "Dry Weight",
        filterParams: defaultFilterParams,
        floatingFilter: true,
        valueFormatter: digitFormatter,
      },
      {
        field: "unitRatePerKg",
        filter: "agSetColumnFilter",
        headerName: "Rate /Kg",
        filterParams: defaultFilterParams,
        floatingFilter: true,
        editable: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: "totalAmount",
        filter: "agSetColumnFilter",
        headerName: "Total Amount",
        filterParams: defaultFilterParams,
        floatingFilter: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: "paymentStatus",
        filter: "agSetColumnFilter",
        headerName: "Payement Status",
        filterParams: defaultFilterParams,
        cellRenderer: "statusRenderer",
        floatingFilter: true,
      },
    ],
    cashcolumnDefs: [
      {
        field: "paymentDate",
        filter: "agDateColumnFilter",
        headerName: "Payement Date",
        filterParams: dateFilterParams,
        floatingFilter: true,
        cellRenderer: (data) => {
          return moment.utc(data.data.paymentDate).format("DD/MM/YYYY");
        },
      },
      {
        field: "paymentType",
        filter: "agSetColumnFilter",
        headerName: "Payement Type",
        editable: true,
        filterParams: defaultFilterParams,
        floatingFilter: true,
        cellRenderer: "paymentTypeRenderer",
      },
      {
        field: "totalAmount",
        filter: "agSetColumnFilter",
        headerName: "Amount",
        filterParams: defaultFilterParams,
        floatingFilter: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: "paymentNotes",
        filter: "agSetColumnFilter",
        headerName: "Notes",
        filterParams: defaultFilterParams,
        editable: true,
        floatingFilter: true,
      },
    ],

    defaultColDef: {
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      suppressHorizontalScroll: true,
      headerComponentParams: {
        template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
          '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          "  </div>" +
          "</div>",
      },
    },
    frameworkComponents: {
      statusRenderer: StatusRenderer,
      paymentTypeRenderer: PaymentTypeRenderer,
    },
  };
  onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };
  onGridReadyLatex = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    API.getLatexCollectionPerCustomer().then((res) => {
      this.setState({ latexCollection: res.data });
    });
  };
  onGridReadyCash = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    API.getCashEntryPerCustomer().then((res) => {
      this.setState({ cashPayments: res.data });
    });
  };
  componentDidMount = () => {
    const { customerId } = this.props.match.params;
    this.loadLatexCollection(customerId);
    this.loadcashPayments(customerId);
    this.loadCustomers(customerId);
  };
  loadLatexCollection = (customerId) => {
    API.getLatexCollectionPerCustomer(customerId)
      .then((res) => {
        this.setState({ latexCollection: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadcashPayments = (customerId) => {
    API.getCashEntryPerCustomer(customerId)
      .then((res) => {
        this.setState({ cashPayments: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadCustomers = (customerId) => {
    API.getCustomer(customerId)
      .then((res) => {
        this.setState({ customerList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleDownloadClick = (event) => {
    console.log(this.state.customerList.customerId);
    this.setState({ gettingInvoices: true });
    API.downloadInvoices({
      customerId: this.state.customerList.customerId,
    }).then((res) => {
      console.log(res);
      mergeAllPDFs(res.data).then((result) =>
        this.setState({ gettingInvoices: false })
      );
    });
  };
  render() {
    let customerName = "Name:\t\t\t\t\t";
    let customerAddress = "Address:\t\t\t\t\t";
    let customerPhone = "Phone Number:\t\t\t";
    let customerEmail = "Email id:\t\t\t\t\t";
    let netDue = "Net Due:\t\t\t";
    let status = "Status:\t\t\t\t\t";
    return (
      <>
        <Navbar></Navbar>
        <Container>
          <div className="twoBox">
            <div className="contact">
              <span id="contacttitle">Contact</span>
              <ListGroup variant="flush" style={{ whiteSpace: "pre" }}>
                <ListGroup.Item>
                  {customerName + this.state.customerList.customerName}
                </ListGroup.Item>
                <ListGroup.Item>
                  {customerAddress + this.state.customerList.customerAddress}
                </ListGroup.Item>
                <ListGroup.Item>
                  {customerPhone + this.state.customerList.customerPhone}
                </ListGroup.Item>
                <ListGroup.Item>
                  {customerEmail +
                    checkEmail(this.state.customerList.customerEmail)}
                </ListGroup.Item>
                <ListGroup.Item
                  id={
                    this.state.customerList.customerStatus
                      ? "active"
                      : "inactive"
                  }
                >
                  {status +
                    customerStatus(this.state.customerList.customerStatus)}
                </ListGroup.Item>
              </ListGroup>
            </div>
            <div className="collectionStatus">
              <span id="collectiontitle">Collection Status</span>
              <ListGroup variant="flush" style={{ whiteSpace: "pre" }}>
                <ListGroup.Item>
                  {netDue +
                    currencyFormatterCollection(
                      this.state.customerList.customerBalance
                    )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <button className="export"> Export</button>
                  <button
                    className="invoice"
                    onClick={() => this.handleDownloadClick()}
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
                    Download Invoices
                  </button>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </div>
          <div className="latexCollection">
            <span id="titletext">Latex Collection</span>
            <div className="ag-theme-alpine grid-box" style={{ height: 450 }}>
              <AgGridReact
                rowData={this.state.latexCollection}
                columnDefs={this.state.latexColumnDefs}
                defaultColDef={this.state.defaultColDef}
                frameworkComponents={this.state.frameworkComponents}
                paginationAutoPageSize={true}
                pagination={true}
                onGridReadyLatex={this.onGridReadyLatex}
                onFirstDataRendered={this.onFirstDataRendered.bind(this)}
              ></AgGridReact>
            </div>
          </div>
          <div className="cashPayment">
            <span id="titletext">Cash Payement</span>
            <div className="ag-theme-alpine grid-box" style={{ height: 450 }}>
              <AgGridReact
                rowData={this.state.cashPayments}
                columnDefs={this.state.cashcolumnDefs}
                defaultColDef={this.state.defaultColDef}
                frameworkComponents={this.state.frameworkComponents}
                paginationAutoPageSize={true}
                pagination={true}
                onGridReadyCash={this.onGridReadyCash}
                onFirstDataRendered={this.onFirstDataRendered.bind(this)}
              ></AgGridReact>
            </div>
          </div>
        </Container>
      </>
    );
  }
}
export default withRouter(SpecificCustomer);
