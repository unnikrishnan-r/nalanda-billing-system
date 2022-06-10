import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import moment from "moment";
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
import Navbar from "../components/Navbar";
import API from "../utils/API";
function headerHeightGetter() {
    var columnHeaderTexts = [
      ...document.querySelectorAll('.ag-header-cell-text'),
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
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
function currencyFormatter(params) {
    return 'Rs.' + formatNumber(params.value);
}



class LatexCollection extends Component {
    state = {

        columnDefs: [
            {
                field: "customerId",
                filter: "agSetColumnFilter",
                headerName: "Customer Id",
                floatingFilter: true,
                //width:130,

            },
            {

                field: "Customer.customerName",
                filter: "agSetColumnFilter",
                headerName: "Customer Name",
                floatingFilter: true,
                //width:130,
            },
            {
                field: "collectionDate",
                filter: "agDateColumnFilter",
                headerName: "Collenction Date",
                floatingFilter: true,
                //width:150,
                cellRenderer: (data) => {
                    return moment(data.collectionDate).format('MM/DD/YYYY HH:mm')
                },

            },
            {
                field: "grossWeight",
                filter: "agSetColumnFilter",
                headerName: "Gross Weight",
                floatingFilter: true,
                editable:true,
                //width:130,
                
            },
            {
                field: "tareWeight",
                filter: "agSetColumnFilter",
                headerName: "Barrel Weight",
                floatingFilter: true,
                //width:130,

            },
            {
                field: "netWeight",
                filter: "agSetColumnFilter",
                headerName: "Net Weight",
                floatingFilter: true,
                //width:130,
            },
            {
                field: "drcPercent",
                filter: "agSetColumnFilter",
                headerName: "DRC %",
                floatingFilter: true,
                editable: true,
                //width:120,
            },
            {
                field: "dryWeight",
                filter: "agSetColumnFilter",
                headerName: "Dry Weight",
                floatingFilter: true,
                //width:130,
            },
            {
                field: "unitRatePerKg",
                filter: "agSetColumnFilter",
                headerName: "Rate /Kg",
                floatingFilter: true,
                //width:130,
            },
            {
                field: "totalAmount",
                filter: "agSetColumnFilter",
                headerName: "Total Amount",
                floatingFilter: true,
                valueFormatter: currencyFormatter,
                //width:130,
            },
            {
                field: "paymentStatus",
                filter: "agSetColumnFilter",
                headerName: "Payement Status",
                cellRenderer: 'statusRenderer',
                floatingFilter: true,
                //width:130,
            },

        ],
        
        defaultColDef: {
            resizable: true,
              sortable: true,
              wrapText: true,
              autoHeight: true,
              suppressHorizontalScroll: false,
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
                  '  </div>' +
                  '</div>',
          },
        },
        frameworkComponents: {
            statusRenderer: StatusRenderer
        },
    };

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        API.getLatexCollection()
            .then((res) => {
                console.log(res);
                this.setState({ latexCollection: res.data });
            })
    };
    onFirstDataRendered = (params) => {
        params.api.sizeColumnsToFit();
      };
    componentDidMount = () => {
        this.loadLatexCollection();
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
                <br></br>
                <Container >
                </Container>
                <br></br>
                <div className="ag-theme-alpine" style={{ height: 500 }} >
                    <AgGridReact
                        rowData={this.state.latexCollection}
                        columnDefs={this.state.columnDefs}
                        defaultColDef={this.state.defaultColDef}
                        frameworkComponents={this.state.frameworkComponents}
                        onGridReady={this.onGridReady}
                        onFirstDataRendered={this.onFirstDataRendered.bind(this)}
                    ></AgGridReact>
                </div>
            </>
        );
    }
}
export default withRouter(LatexCollection);