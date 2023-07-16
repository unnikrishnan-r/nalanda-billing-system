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

import { Container, ListGroup, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import NewLedgerEntryForm from "../components/NewLedgerEntryForm";
import LedgerTypeRenderer from "../components/LedgerTypeRenderer";
import API from "../utils/API";
function formatNumber(number) {
  return Number(number)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function currencyFormatter(params) {
  return Number.isInteger(params.value)
    ? "Rs." + formatNumber(params.value)
    : "";
}
function customerStatus(params) {
  if (params) {
    return "Active";
  } else return "Inactive";
}

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
class SpecificLedgerCustomer extends Component {
  state = {
    addLedgerEntryFormTrigger: false,
    generatedLedger: "",
    customerList: [],
    cashcolumnDefs: [
      {
        field: "paymentDate",
        filter: "agDateColumnFilter",
        headerName: "Payement Date",
        filterParams: dateFilterParams,
        floatingFilter: true,
        cellRenderer: (data) => {
          return moment.utc(data.data.ledgerEntryDate).format("DD/MM/YYYY");
        },
      },
      {
        field: "creditAmount",
        filter: "agSetColumnFilter",
        headerName: "Credit",
        filterParams: defaultFilterParams,
        editable: true,
        floatingFilter: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: "debitAmount",
        filter: "agSetColumnFilter",
        headerName: "Debit",
        filterParams: defaultFilterParams,
        editable: true,
        floatingFilter: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: "balanceAmount",
        filter: "agSetColumnFilter",
        headerName: "Balance",
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
      ledgerTypeRenderer: LedgerTypeRenderer,
    },
  };
  showLedgerEntryForm = () => {
    this.setState({
      addLedgerEntryFormTrigger: true,
    });
  };
  closeLedgerEntryForm = () => {
    this.setState({
      addLedgerEntryFormTrigger: false,
    });
    this.componentDidMount();
  };

  onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };
  //Update function
  onCellValueChanged = (params) => {
    let ledgerUpdateEntry = {
      customerId: params.data.customerId,
      ledgerEntryDate: params.data.ledgerEntryDate,
      paymentType: params.data.paymentType,
      totalAmount: params.data.paymentType == 0? params.data.debitAmount : params.data.creditAmount,
      paymentNotes: params.data.paymentNotes 
    };
    console.log(ledgerUpdateEntry)
    API.updateSpecificLatexEntry(ledgerUpdateEntry)
      .then((res) => {
        this.componentDidMount();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onGridReadyCash = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    API.getLedgerEntryPerCustomer().then((res) => {
      this.setState({ ledgerEntries: res.data });
    });
  };
  componentDidMount = () => {
    const { customerId } = this.props.match.params;
    this.loadLedgerEntries(customerId);
    this.loadLedgerCustomers(customerId);
    this.setState({
      addLedgerEntryFormTrigger: false,
    });
  };
  loadLedgerEntries = (customerId) => {
    API.getLedgerEntryPerCustomer(customerId)
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].creditAmount =
            res.data[i].paymentType === "1" ? res.data[i].totalAmount : " ";
          res.data[i].debitAmount =
            res.data[i].paymentType === "0" ? res.data[i].totalAmount : " ";
          if (i === 0) {
            res.data[i].balanceAmount =
              res.data[i].creditAmount - res.data[i].debitAmount;
          } else {
            res.data[i].balanceAmount =
              res.data[i].creditAmount -
              res.data[i].debitAmount +
              res.data[i - 1].balanceAmount;
          }
        }
        console.log(res.data);
        this.setState({ ledgerEntries: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadLedgerCustomers = (customerId) => {
    API.getLedgerCustomer(customerId)
      .then((res) => {
        this.setState({ customerList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handlePrintLedger = (event) => {
    console.log(this.state.customerList.customerId);
    this.setState({ gettingLedger: true });
    API.generateLedgerStatement({
      customerId: this.state.customerList.customerId,
    }).then((res) => {
      console.log(res.data);
      this.setState({
        generatedLedger: res.data,
      });
      API.uploadLedgerToAws({ file: res.data }).then((res) => {
        mergeAllPDFs(res.data).then((result) =>
          this.setState({ gettingLedger: false })
        );
      });
    });
  };
  render() {
    let customerName = "Name:\t\t\t\t\t";
    let customerAddress = "Address:\t\t\t\t\t";
    // let customerPhone = "Phone Number:\t\t\t";
    // let customerEmail = "Email id:\t\t\t\t\t";
    // let netDue = "Net Due:\t\t\t";
    let status = "Status:\t\t\t\t\t";
    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <Container></Container>

        <div className="sub-header">
          <button id="addCashPayment" onClick={this.showLedgerEntryForm}>
            Add Ledger
          </button>
          <button id="addCustomer" onClick={() => this.handlePrintLedger()}>
            {this.state.gettingLedger ? (
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
            Print Ledger
          </button>
          <br></br>
        </div>

        <br></br>

        <Container>
          <div className="twoBox">
            <div className="ledgercontact">
              <span id="contacttitle">Contact</span>
              <ListGroup variant="flush" style={{ whiteSpace: "pre" }}>
                <ListGroup.Item>
                  {customerName + this.state.customerList.customerName}
                </ListGroup.Item>
                <ListGroup.Item>
                  {customerAddress + this.state.customerList.customerAddress}
                </ListGroup.Item>
                {/* <ListGroup.Item>
                  {customerPhone + this.state.customerList.customerPhone}
                </ListGroup.Item>
                <ListGroup.Item>
                  {customerEmail +
                    checkEmail(this.state.customerList.customerEmail)}
                </ListGroup.Item> */}
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
          </div>

          <div className="ledgerEntries">
            <span id="titletext">Ledger Statement</span>
            <div className="ag-theme-alpine grid-box" style={{ height: 450 }}>
              <AgGridReact
                rowData={this.state.ledgerEntries}
                columnDefs={this.state.cashcolumnDefs}
                defaultColDef={this.state.defaultColDef}
                frameworkComponents={this.state.frameworkComponents}
                paginationAutoPageSize={true}
                pagination={true}
                onCellValueChanged={this.onCellValueChanged}
                onGridReadyCash={this.onGridReadyCash}
                onFirstDataRendered={this.onFirstDataRendered.bind(this)}
              ></AgGridReact>
            </div>
          </div>
        </Container>

        <NewLedgerEntryForm
          trigger={this.state.addLedgerEntryFormTrigger}
          closeLedgerEntryForm={this.closeLedgerEntryForm}
        ></NewLedgerEntryForm>
      </>
    );
  }
}
export default withRouter(SpecificLedgerCustomer);
