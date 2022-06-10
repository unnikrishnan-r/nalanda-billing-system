import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";

import API from "../../utils/API";
const animatedComponent = makeAnimated();

class AddLatexForm extends Component {
    state = {
        selectedUsers: [],
        validated: false,
        collectionDate: "2022-02-02",
        tareWeight: 0,
        grossWeight: 1,
        barrelNumber: "",
    };
    onChange = (selectedUsers) => {
        this.setState({
            selectedUsers: selectedUsers || [],
        });
        console.log(selectedUsers);
    };

    // Handles updating component state when the user types into the input field
    handleInputChange = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value,
        });
    };

    handleOnSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log("Submited");
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            this.setState({ validated: true });
        } else {
            this.setState({ validated: true });
            const newLatexEntry = {
                customerId: this.state.selectedUsers[0].value,
                collectionDate: this.state.collectionDate,
                tareWeight: this.state.tareWeight,
                grossWeight: this.state.grossWeight,
                barrelNumber: this.state.barrelNumber,
            };
            console.log(newLatexEntry);
            API.addLatexEntry(newLatexEntry)
                .then((res) => {
                    console.log(res);
                    this.setState({
                        selectedUsers: [],
                        validated: false,
                        collectionDate: "2022-02-02",
                        tareWeight: 0,
                        grossWeight: 1,
                        barrelNumber:"",
                    });
                    this.props.closeAddlatexForm();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    render() {
        return this.props.trigger ? (
            <div className="newLatex">
                {" "}
                <div className="newLatexInner">
                    <h1>Add Latex Collection</h1>
                    <br></br>
                    <AsyncSelect
                        components={animatedComponent}
                        value={this.state.selectedUsers}
                        placeholder={"Select Customer"}
                        loadOptions={API.loadOptions}
                        onChange={this.onChange}
                    />
                    <Form
                        noValidate
                        validated={this.state.validated}
                        onSubmit={this.handleOnSubmit}
                    >
                        <br></br>
                        <br></br>

                        <Form.Group>
                            <div className="titleText">
                                <Form.Label>Collection Date</Form.Label>
                            </div>
                            <Form.Control
                                type="date"
                                placeholder="DD/MM/YYYY"
                                name="collectionDate"
                                onChange={this.handleInputChange}
                                value={this.state.collectionDate}
                                maxLength={10}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <div className="titleText">
                                <Form.Label>Barrel Weight</Form.Label>
                            </div>
                            <Form.Control
                                type="number"
                                placeholder="in Kgs"
                                name="tareWeight"
                                onChange={this.handleInputChange}
                                value={this.state.tareWeight}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <div className="titleText">
                                <Form.Label>Gross Weight</Form.Label>
                            </div>
                            <Form.Control
                                type="number"
                                placeholder="in Kgs"
                                name="grossWeight"
                                onChange={this.handleInputChange}
                                value={this.state.grossWeight}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <div className="titleText">
                                <Form.Label>Barrel Number</Form.Label>
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="barrel-no"
                                name="barrelNumber"
                                onChange={this.handleInputChange}
                                value={this.state.barrelNumber}
                                required
                            />
                        </Form.Group>

                        <Button
                            id="subBtn"
                            variant="info"
                            className="btn btn-light cancel-button"
                            onClick={() => this.props.closeAddlatexForm()}
                        >
                            Cancel
                        </Button>

                        <Button
                            id="subBtn"
                            variant="info"
                            type="submit"
                            className="btn btn-success submit-button"
                            onClick={() => this.props.onSubmit}
                        >
                            Add collection
                        </Button>
                    </Form>
                </div>
            </div>
        ) : (
            ""
        );
    }
}

export default withRouter(AddLatexForm);