import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import moment from "moment";
import API from "../../utils/API";
const animatedComponent = makeAnimated();

class AddLatexForm extends Component {
    state = {
        selectedUsers: [],
        validated: false,
        collectionDate: moment(),
        grossWeight: "",
        tareWeight:"",
        barrelNumber: "Default",
    };
    onChange = (selectedUsers) => {
        this.setState({
            selectedUsers: selectedUsers || [],
        });
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
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            this.setState({ validated: true });
        } else {
            this.setState({ validated: true });
            const newLatexEntry = {
                customerId: this.state.selectedUsers.value,
                collectionDate: moment.utc(this.state.collectionDate).format("MM/DD/YYYY"),
                grossWeight: this.state.grossWeight,
                tareWeight: this.state.tareWeight,
                barrelNumber: this.state.barrelNumber
            };
            API.addLatexEntry(newLatexEntry)
                .then((res) => {
                    this.setState({
                        selectedUsers: [],
                        validated: false,
                        collectionDate: moment(),
                        grossWeight: "",
                        tareWeight:"",
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
                    <h4 style={{ fontWeight: "bold"}}>New latex collection entry</h4>
                    <hr size="" width="" color="grey"/>  
                    <br></br>
                    <h6 style={{display:"inline"}}>Customer Name</h6><span id="mandatory"> * </span>
                   
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
                        <Form.Group>
                            <div className="titleText">
                                <Form.Label>Collection Date</Form.Label><span id="mandatory"> * </span>
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
                                <Form.Label>Gross Weight</Form.Label><span id="mandatory"> * </span>
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
                                <Form.Label>Barrel Weight</Form.Label><span id="mandatory"> * </span>
                            </div>
                            <Form.Control
                                type="text"
                                placeholder="in Kgs"
                                name="tareWeight"
                                onChange={this.handleInputChange}
                                value={this.state.tareWeight}
                                required
                            />
                        </Form.Group>
                        <hr size="" width="" color="grey"/>  
                        <Button
                            id="subBtn"
                            variant="info"
                            type="submit"
                            className="btn btn-success submit-button"
                            onClick={() => this.props.onSubmit}
                        >
                            Add collection
                        </Button>
                        <Button
                            id="subBtn"
                            variant="info"
                            className="btn btn-light cancel-button"
                            onClick={() => this.props.closeAddlatexForm()}
                        >
                            Cancel
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