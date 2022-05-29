import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import BtnCellRenderer from "../components/BtnCellRenderer";
import Moment from 'react-moment';
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
function formatNumber(number) {
    return Math.floor(number)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
function currencyFormatter(params) {
    return 'Rs.' + formatNumber(params.value);
}
function dateFormate(params)
{
    return <Moment>{params.value}</Moment>
}
class LatexCollection extends Component {
    state = {
        columnDefs: [
            {
                field: "customerId",
                filter: "agSetColumnFilter",
                headerName: "Customer Id",
                floatingFilter: true
            },
            {

                field: "customerName",
                filter: "agSetColumnFilter",
                headerName: "Customer Name",
                floatingFilter: true
            },
            {
                field: "collectionDate",
                filter: "agDateColumnFilter",
                headerName: "Collenction Date",
                valueFormatter: dateFormate,
                floatingFilter: true
            },
            {
                field: "grossWeight",
                filter: "agSetColumnFilter",
                headerName: "Gross Weight",
                floatingFilter: true
            },
            {
                field: "tareWeight",
                filter: "agSetColumnFilter",
                headerName: "Barrel Weight",
                floatingFilter: true,

            },
            {
                field: "netWeight",
                filter: "agSetColumnFilter",
                headerName: "Net Weight",
                floatingFilter: true
            },
            {
                field: "drcPercent",
                filter: "agSetColumnFilter",
                headerName: "DRC %",
                floatingFilter: true
            },
            {
                field: "dryWeightt",
                filter: "agSetColumnFilter",
                headerName: "Dry Weight",
                floatingFilter: true
            },
            {
                field: "unitRatePerKg",
                filter: "agSetColumnFilter",
                headerName: "Rate /Kg",
                floatingFilter: true
            },
            {
                field: "totalAmount",
                filter: "agSetColumnFilter",
                headerName: "Total Amount",
                floatingFilter: true,
                valueFormatter: currencyFormatter
            },
            {
                field: "payementStatus",
                filter: "agSetColumnFilter",
                headerName: "Payement Status",
                floatingFilter: true,
            },

        ],
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
                <div className="ag-theme-alpine" style={{ height: 500 }}>
                    <AgGridReact
                        rowData={this.state.latexCollection}
                        columnDefs={this.state.columnDefs}
                        frameworkComponents={this.state.frameworkComponents}
                    ></AgGridReact>
                </div>
            </>
        );
    }
}
export default withRouter(LatexCollection);