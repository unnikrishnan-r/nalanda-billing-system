import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";

import { Container, Form } from "react-bootstrap";
import Navbar from "../components/Navbar";
import NewCustomerForm from "../components/NewCustomerForm";
import NewBillingForm from "../components/NewBillingForm";

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
function LinkComponent(params) {
  return <Link to={"/specificUser/" + params.value}>{params.value}</Link>;
}
let gridApi;

function checkCellEditableStatus(params) {
  return params.data.customerStatus;
}

function getRowStyle(params) {
  return {
    backgroundColor: !params.data.customerStatus ? "#F5F5F5" : "#FFFFFF",
    fontStyle: !params.data.customerStatus ? "italic" : "normal",
    color: !params.data.customerStatus ? "grey" : "black",
  };
}

class MainPage extends Component {
  state = {
    addCustomerFormTrigger: false,
    customerList: [],
    columnDefs: [
      {
        field: "customerId",
        filter: "agSetColumnFilter",
        headerName: "Customer Id",
        floatingFilter: true,
        sortable: true,
        cellRenderer: LinkComponent,
      },
      {
        field: "customerName",
        filter: "agSetColumnFilter",
        headerName: "Customer Name",
        editable: checkCellEditableStatus,
        floatingFilter: true,
        sortable: true,
      },
      {
        field: "customerAddress",
        filter: "agSetColumnFilter",
        headerName: "Address",
        editable: checkCellEditableStatus,
        floatingFilter: true,
      },
      {
        field: "customerPhone",
        filter: "agSetColumnFilter",
        headerName: "Phone",
        editable: checkCellEditableStatus,
        floatingFilter: true,
      },
      {
        field: "customerBalance",
        filter: "agSetColumnFilter",
        headerName: "Net Due Amount",
        floatingFilter: true,
        sortable: true,
        valueFormatter: currencyFormatter,
      },
      {
        field: "customerStatus",
        filter: "agSetColumnFilter",
        headerName: "Customer Status",
        floatingFilter: true,
        sortable: true,
        cellRenderer: (params) => (
          <Form.Check
            type="switch"
            id={params.data.customerId}
            checked={params.data.customerStatus}
            onChange={() => this.handleCustomerStatusChange(params)}
          />
        ),
      },
    ],
    defaultColDef: {
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      flex: 1,
    },
  };
  //Function to handle the change of customer status switch
  handleCustomerStatusChange(params) {
    /*Creates a copy of the customerList
    1. use "map" to search original customer list using the id of the clicked switch to locate the object to update
    2. If found, replace the customer status by flipping the current value of the switch
    3. If not found, return the original customer
    4. Use Set State to update the latest customer list to state
    5. Update the database
    */
    let newCustomerList = this.state.customerList.map((oldCustomer) =>
      oldCustomer.customerId === params.data.customerId
        ? { ...oldCustomer, customerStatus: !params.data.customerStatus }
        : oldCustomer
    );
    this.setState({ customerList: newCustomerList });
    API.updateCustomer({
      ...params.data,
      customerStatus: !params.data.customerStatus,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //Update function
  onCellValueChanged(params) {
    API.updateCustomer(params.data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showAddCustomerForm = () => {
    this.setState({
      addCustomerFormTrigger: true,
    });
  };

  showNewBillingForm = () => {
    this.setState({
      newBillingFormTrigger: true,
    });
  };
  closeAddCustomerForm = () => {
    this.setState({
      addCustomerFormTrigger: false,
    });
    this.componentDidMount();
  };

  closeNewBillingForm = () => {
    this.setState({
      newBillingFormTrigger: false,
    });
    this.componentDidMount();
  };

  componentDidMount = () => {
    this.loadCustomers();
    this.setState({
      addCustomerFormTrigger: false,
      newBillingFormTrigger: false,
    });
  };
  loadCustomers = () => {
    API.getCustomerList()
      .then((res) => {
        this.setState({ customerList: res.data });
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
          <button id="addCustomer" onClick={this.showNewBillingForm}>
            Generate Bill
          </button>
          <button id="addCustomer" onClick={this.showAddCustomerForm}>
            Add Customer
          </button>
          <button className="exportbtn" onClick={this.onExportClick}>
            {" "}
            Export
          </button>
          <br></br>
        </div>
        <br></br>
        <div className="ag-theme-alpine grid-box" style={{ height: 500 }}>
          <AgGridReact
            rowData={this.state.customerList}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            getRowStyle={getRowStyle}
            paginationAutoPageSize={true}
            pagination={true}
            onCellValueChanged={this.onCellValueChanged}
            onGridReady={this.onGridReady}
          ></AgGridReact>
        </div>

        <NewCustomerForm
          trigger={this.state.addCustomerFormTrigger}
          closeAddCustomerForm={this.closeAddCustomerForm}
        ></NewCustomerForm>

        <NewBillingForm
          trigger={this.state.newBillingFormTrigger}
          closeNewBillingForm={this.closeNewBillingForm}
        ></NewBillingForm>

        <br></br>
      </>
    );
  }
}
export default withRouter(MainPage);
