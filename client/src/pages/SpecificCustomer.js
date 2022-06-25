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
import Navbar from "../components/Navbar";
import PaymentTypeRenderer from "../components/PaymenTypeRenderer";
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
        latexColumnDefs: [
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
                editable: true,
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
            }

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
            console.log(res);
            this.setState({ latexCollection: res.data });
        });
    };
    onGridReadyCash = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        API.getCashEntryPerCustomer().then((res) => {
            console.log(res);
            this.setState({ cashPayments: res.data });
        });
    };
    componentDidMount = () => {
        const { customerId } = this.props.match.params;
        this.loadLatexCollection(customerId);
        this.loadcashPayments(customerId);
        console.log(this.componentRef);
    };
    loadLatexCollection = (customerId) => {
        console.log("Calling Latex Data for Customer " , customerId)
        API.getLatexCollectionPerCustomer(customerId)
            .then((res) => {
                console.log(res.data);
                this.setState({ latexCollection: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    loadcashPayments = (customerId) => {
        API.getCashEntryPerCustomer(customerId)
            .then((res) => {
                console.log(res.data);
                this.setState({ cashPayments: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    render() {
        return (
            <>
                <Navbar></Navbar>
                <Container>
                    <div className="customerDetails">

                    </div>
                    <div className="twoBox">
                        <div className="contact">

                        </div>
                        <div className="collectionStatus">

                        </div>
                    </div>
                    <div className="latexCollection">
                        <h4>Latex Collection</h4>
                        <div className="ag-theme-alpine grid-box"
                            style={{ height: 450 }}
                        >
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
                        <h4>Cash Payement</h4>
                        <div className="ag-theme-alpine grid-box"
                            style={{ height: 450 }}
                        >
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