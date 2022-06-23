import axios from "axios";

export default {
  getCustomerList: function () {
    return axios.get("https://nalandaapi.herokuapp.com/api/newcustomer");
  },
  updateCustomer: function (customer) {
    console.log(customer);
    return axios.put(
      `https://nalandaapi.herokuapp.com/api/newcustomer/${customer.customerId}`,
      customer,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  createCustomer: function (customer) {
    console.log(customer);
    return axios.post(
      `https://nalandaapi.herokuapp.com/api/newcustomer`,
      customer,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  createCashEntry: function (cashEntry) {
    console.log(cashEntry);
    return axios.post(
      `https://nalandaapi.herokuapp.com/api/cashPayment`,
      cashEntry,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  addLatexEntry: function (latexEntry) {
    console.log(latexEntry);
    return axios.post(
      `https://nalandaapi.herokuapp.com/api/latexCollection`,
      latexEntry,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  updateLatexEntry: function (latexEntry) {
    console.log(latexEntry);
    return axios.put(
      `https://nalandaapi.herokuapp.com/api/latexCollection/key`,
      latexEntry,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  getLatexCollection: function () {
    return axios.get("https://nalandaapi.herokuapp.com/api/latexCollection");
  },
  calculateInvoiceAmount: function (invoiceReq) {
    console.log(invoiceReq);
    return axios.post(
      `https://nalandaapi.herokuapp.com/api/calculateInvoiceAmount`,
      invoiceReq,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  applyRate: function (invoiceReq) {
    console.log(invoiceReq);
    return axios.post(
      `http://localhost:3005/api/applyRate`,
      invoiceReq,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  loadOptions: async (inputText, callback) => {
    const response = await fetch(
      `https://nalandaapi.herokuapp.com/api/newcustomer/search?searchString=${inputText}`
    );
    const json = await response.json();

    callback(json.map((i) => ({ label: i.customerName, value: i.customerId })));
  },
  getCashEntry: function () {
    return axios.get("https://nalandaapi.herokuapp.com/api/cashPayment");
  },
  getBillingHistory: function (){
    return axios.get("https://nalandaapi.herokuapp.com/api/billingSummary")
  }
};
