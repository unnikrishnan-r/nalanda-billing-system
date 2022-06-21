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
  Row,
  Col,
  Container,
  Form,
  Button,
  Dropdown,
  Jumbotron,
  Modal,
  Table,
} from "react-bootstrap";
import AddLatex from "../components/AddLatex";
import Navbar from "../components/Navbar";
import API from "../utils/API";
function headerHeightGetter() {
  var columnHeaderTexts = [
    ...document.querySelectorAll(".ag-header-cell-text"),
  ];
  var clientHeights = columnHeaderTexts.map(
    (headerText) => headerText.clientHeight
  );
  var tallestHeaderTextHeight = Math.max(...clientHeights);

  return tallestHeaderTextHeight;
}
function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function currencyFormatter(params) {
  return "Rs." + formatNumber(params.value);
}
let gridApi;

var dateFilterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = moment.utc(cellValue).format("DD/MM/YYYY");
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('/');
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
  buttons: ['clear']
};
var defaultFilterParams = {
  buttons: ['clear']
};
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
        editable: true,
      },
      {
        field: "tareWeight",
        filter: "agSetColumnFilter",
        headerName: "Barrel Weight",
        filterParams: defaultFilterParams,
        floatingFilter: true,
        editable: true,
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
        editable: true,
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
  };

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
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    API.getLatexCollection().then((res) => {
      console.log(res);
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
    console.log(this.componentRef)
  };
  
  loadLatexCollection = () => {
    API.getLatexCollection()
      .then((res) => {
        console.log(res);
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
        <div className="sub-header">
        <button id="addCollection" onClick={this.showAddLatexForm}>
          Add Collection
        </button>
        <button className="exportbtn" onClick={this.onExportClick}>
          {" "}
          Export
        </button>
        <div style={{ width: '100%', height: '100%' }}>
        <button className="printbtn"> Print</button>
        </div>
        <br></br>
        </div>
        <br></br>
        <div className="ag-theme-alpine grid-box" style={{ height: 500 }} ref={el=>(this.componentRef=el)}>
          <AgGridReact
            rowData={this.state.latexCollection}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
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
