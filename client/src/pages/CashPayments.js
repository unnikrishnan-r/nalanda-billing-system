import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";
import moment from "moment";
import {
  Container,
} from "react-bootstrap";
import Navbar from "../components/Navbar";
import NewCashPaymentForm from "../components/NewCashPaymentForm";
import API from "../utils/API";
import PaymentTypeRenderer from "../components/PaymenTypeRenderer";
function formatNumber(number) {
  return Number(number).toFixed(2)
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
class CashPayments extends Component {
  state = {
    addCashPaymentFormTrigger: false,
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
        filterParams: defaultFilterParams,
        floatingFilter: true,
        cellRenderer: "paymentTypeRenderer"
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
      flex: 1,
    },
    frameworkComponents: {
      paymentTypeRenderer: PaymentTypeRenderer,
    },
  };

  showCashPaymentForm = () => {
    this.setState({
      addCashPaymentFormTrigger: true,
    });
  };
  closeCashPaymentForm = () => {
    this.setState({
      addCashPaymentFormTrigger: false,
    });
    this.componentDidMount();
  };
  componentDidMount = () => {
    this.loadcashPayments();
  };
  loadcashPayments = () => {
    API.getCashEntry()
      .then((res) => {
        this.setState({ cashPayments: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onGridReady = (params) => {
    gridApi = params.api;
  };
  onExportClick = () => {
    gridApi.exportDataAsCsv();
  };
  render() {
    return (
      <>
        <Navbar></Navbar>
        <br></br>
        <Container></Container>
        <div className="sub-header">
          <button id="addCashPayment" onClick={this.showCashPaymentForm}>
            Add Cash Entry
          </button>
          <button className="exportbtn" onClick={this.onExportClick}>
            {" "}
            Export
          </button>
          <button className="printbtn"> Print</button>
          <br></br>
        </div>

        <br></br>
        <div className="ag-theme-alpine grid-box" style={{ height: 500 }} ref={el=>(this.componentRef=el)}>
          <AgGridReact
            rowData={this.state.cashPayments}
            columnDefs={this.state.columnDefs}
            frameworkComponents={this.state.frameworkComponents}
            defaultColDef={this.state.defaultColDef}
            paginationAutoPageSize={true}
            pagination={true}
            onGridReady={this.onGridReady}
          ></AgGridReact>
        </div>
        <NewCashPaymentForm
          trigger={this.state.addCashPaymentFormTrigger}
          closeCashPaymentForm={this.closeCashPaymentForm}
        ></NewCashPaymentForm>
      </>
    );
  }
}
export default withRouter(CashPayments);
