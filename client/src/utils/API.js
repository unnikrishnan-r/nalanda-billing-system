import axios from "axios";

export default {
  getCustomerList: function () {
    return axios.get("https://nalandaapi.herokuapp.com/api/newcustomer");
  },
  updateCustomer: function (customer) {
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
  getCashEntryPerCustomer: function (customerId) {
    return axios.get("https://nalandaapi.herokuapp.com/api/cashPayment/key?customerId="+customerId);
  },
  getCustomer: function (customerId) {
    return axios.get("https://nalandaapi.herokuapp.com/api/newcustomer/"+customerId);
  },
  getLatexCollectionPerCustomer: function (customerId) {
    return axios.get("https://nalandaapi.herokuapp.com/api/latexCollection/key?customerId="+customerId);
  },
  calculateInvoiceAmount: function (invoiceReq) {
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

  generateInvoices: function (billToDate) {
    return axios.put(
      `https://nalandaapi.herokuapp.com/api/invoiceGeneration/generateInvoiceForCustomer`,
      billToDate,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  applyRate: function (invoiceReq) {
    return axios.post(
      `https://nalandaapi.herokuapp.com/api/applyRate`,
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
