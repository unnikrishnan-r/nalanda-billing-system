import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import "./style.css";

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
import Navbar from "../components/Navbar";
import NewCustomerForm from "../components/NewCustomerForm";
import API from "../utils/API";
function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
function currencyFormatter(params) {
  return "Rs." + formatNumber(params.value);
}
class MainPage extends Component {
  state = {
    addCustomerFormTrigger: false,
    customerList: [],
    // rowdata: [
    //   { make: "Toyota", model: "Celica", price: 35000 },
    //   { make: "Ford", model: "Mondeo", price: 32000 },
    //   { make: "Porsche", model: "Boxster", price: 72000 },
    // ],
    columnDefs: [
      {
        field: "customerId",
        filter: "agSetColumnFilter",
        headerName: "Customer Id",
        floatingFilter: true,
        sortable: true,
      },
      {
        field: "customerName",
        filter: "agSetColumnFilter",
        headerName: "Customer Name",
        editable: true,
        floatingFilter: true,
        sortable: true,
      },
      {
        field: "customerAddress",
        filter: "agSetColumnFilter",
        headerName: "Address",
        editable: true,
        floatingFilter: true,
      },
      {
        field: "customerPhone",
        filter: "agSetColumnFilter",
        headerName: "Phone",
        editable: true,
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
    console.log(params.data);
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
  closeAddCustomerForm = () => {
    this.setState({
      addCustomerFormTrigger: false,
    });
    this.componentDidMount();
  };

  handleNewCustomerFormChange =(x) =>{
    console.log(x)

  };
  submitAddCustomerForm =() =>{
    console.log("clicked submit")
  }
  componentDidMount = () => {
    console.log("Component mount")
    this.loadCustomers();
    this.setState({ addCustomerFormTrigger: false });
  };
  loadCustomers = () => {
    API.getCustomerList()
      .then((res) => {
        console.log(res);
        this.setState({ customerList: res.data });
        // console.log(this.state.customerList);
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
        <br></br>
        <Container></Container>
        <br></br>
        <button onClick={this.showAddCustomerForm}>Add Customer</button>
        <br></br>
        <br></br>
        <div className="ag-theme-alpine" style={{ height: 500 }}>
          <AgGridReact
            rowData={this.state.customerList}
            columnDefs={this.state.columnDefs}
            paginationAutoPageSize={true}
            pagination={true}
            onCellValueChanged={this.onCellValueChanged}
          ></AgGridReact>
        </div>

        <NewCustomerForm
          trigger={this.state.addCustomerFormTrigger}
          closeAddCustomerForm={this.closeAddCustomerForm}
          submitAddCustomerForm={this.submitAddCustomerForm}
        >
        </NewCustomerForm>
        <br></br>
      </>
    );
  }
}
export default withRouter(MainPage);
