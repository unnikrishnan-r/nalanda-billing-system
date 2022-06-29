import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import moment from "moment";
import "./style.css";
import StatusRenderer from "../components/StatusRenderer";
import {
  Container,
  Form,
  Button,
} from "react-bootstrap";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

import AddLatex from "../components/AddLatex";
import Navbar from "../components/Navbar";
import API from "../utils/API";

function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function currencyFormatter(params) {
  return "Rs." + formatNumber(params.value);
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

function checkCellEditableStatus(params) {
  return !params.data.paymentStatus;
}

function getRowStyle(params) {
  return {
    backgroundColor: params.data.paymentStatus ? "#F5F5F5" : "#FFFFFF",
    fontStyle: params.data.paymentStatus ? "italic" : "normal",
    color: params.data.paymentStatus ? "grey" : "black",
  };
}
class LatexCollection extends Component {
  state = {
    addLatexFormTrigger: false,
    columnDefs: [
      {
        field: "customerId",
        filter: "agSetColumnFilter",
        headerName: "Customer Id",
        filterParams: defaultFilterParams,
        floatingFilter: true,
      },
      {
        field: "Customer.customerName",
        filter: "agSetColumnFilter",
        headerName: "Customer Name",
        filterParams: defaultFilterParams,
        floatingFilter: true,
      },
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
        editable: checkCellEditableStatus,
      },
      {
        field: "tareWeight",
        filter: "agSetColumnFilter",
        headerName: "Barrel Weight",
        filterParams: defaultFilterParams,
        floatingFilter: true,
        editable: checkCellEditableStatus,
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
        editable: checkCellEditableStatus,
      },
      {
        field: "dryWeight",
        filter: "agSetColumnFilter",
        headerName: "Dry Weight",
        filterParams: defaultFilterParams,
        floatingFilter: true,
      },
      {
        field: "unitRatePerKg",
        filter: "agSetColumnFilter",
        headerName: "Rate /Kg",
        filterParams: defaultFilterParams,
        floatingFilter: true,
        editable: checkCellEditableStatus,
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
        editable: true,
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
    },
    billFromDate: moment(),
    billToDate: moment(),
    ratePerKg: 0,
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

  applyRateForAllCustomers() {
    console.log(this.state);
    API.applyRate({
      billFromDate: this.state.billFromDate,
      billToDate: this.state.billToDate,
      unitRatePerKg: parseInt(this.state.ratePerKg),
    })
      .then((res) => {
        console.log(res);
        this.componentDidMount();
      })
      .catch((err) => console.log(err));
  }

  //Update function
  onCellValueChanged = (params) => {
    console.log(params.data);
    API.updateLatexEntry(params.data)
      .then((res) => {
        console.log(res);
        this.componentDidMount();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    API.getLatexCollection().then((res) => {
      this.setState({ latexCollection: res.data });
    });
  };
  onExportClick = () => {
    this.gridApi.exportDataAsCsv();
  };
  onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };
  showAddLatexForm = () => {
    this.setState({
      addLatexFormTrigger: true,
    });
  };
  closeAddlatexForm = () => {
    this.setState({
      addLatexFormTrigger: false,
    });
    this.componentDidMount();
  };
  componentDidMount = () => {
    this.loadLatexCollection();
  };

  loadLatexCollection = () => {
    API.getLatexCollection()
      .then((res) => {
        this.setState({ latexCollection: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <Container></Container>
        <div className="gridstyle">
          <div className="grid-container">
            <div className="grid-child purple" id="lspace">
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
                  <Form.Label className="titleText">Average Rate</Form.Label>
                </div>

                <Form.Control
                  type="number"
                  placeholder="Enter the rate per kg"
                  name="ratePerKg"
                  onChange={this.handleInputChange}
                  value={this.state.ratePerKg}
                  maxLength={10}
                  required
                  bsPrefix="avg-rate"
                />
              </Form.Group>
            </div>
            <div className="grid-child purple" id="lbtns" >
              <Form.Group>
                <div className="titleText">
                  <Form.Label className="titleText"></Form.Label>
                </div>
                <button id="addCollection" onClick={this.showAddLatexForm}>
                  Add Collection
                </button>
                <Button
                  id="applybtn"
                  variant="info"
                  type="submit"
                  className="btn btn-success submit-button calc-button"
                  onClick={() => this.applyRateForAllCustomers()}
                >
                  Apply Rate
                </Button>{" "}
              </Form.Group>
            </div>
          </div>
        </div>
        {/* <div className="sub-header"> */}
        {/* <button id="addCollection" onClick={this.showAddLatexForm}>
            Add Collection
          </button> */}
        {/* <button className="exportbtn" onClick={this.onExportClick}>
            {" "}
            Export
          </button>
          <div style={{ width: "100%", height: "100%" }}>
            <button className="printbtn"> Print</button>
          </div> */}
        {/* <br></br>
        </div> */}
        <br></br>
        <div
          className="ag-theme-alpine grid-box"
          style={{ height: 500 }}
          ref={(el) => (this.componentRef = el)}
        >
          <AgGridReact
            rowData={this.state.latexCollection}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            getRowStyle={getRowStyle}
            frameworkComponents={this.state.frameworkComponents}
            paginationAutoPageSize={true}
            pagination={true}
            onCellValueChanged={this.onCellValueChanged}
            onGridReady={this.onGridReady}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
          ></AgGridReact>
          <AddLatex
            trigger={this.state.addLatexFormTrigger}
            closeAddlatexForm={this.closeAddlatexForm}
          ></AddLatex>
        </div>
      </>
    );
  }
}
export default withRouter(LatexCollection);
