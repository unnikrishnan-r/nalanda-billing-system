import axios from "axios";
require("dotenv").config();

const API = process.env.REACT_APP_API || "http://localhost:3005";
console.log(API);
export default {
  //Check If its a valid log in
  checkLogin: function (userLoginData) {
    return axios.post(API + "/api/login", userLoginData);
  },
  logout: function () {
    return axios.get(API + "/api/logout");
  },
  getCustomerList: function () {
    return axios.get(API + "/api/newcustomer");
  },
  updateCustomer: function (customer) {
    return axios.put(
      API + `/api/newcustomer/${customer.customerId}`,
      customer,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
  createCustomer: function (customer) {
    return axios.post(API + `/api/newcustomer`, customer, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  createCashEntry: function (cashEntry) {
    return axios.post(API + `/api/cashPayment`, cashEntry, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  addLatexEntry: function (latexEntry) {
    return axios.post(API + `/api/latexCollection`, latexEntry, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  updateLatexEntry: function (latexEntry) {
    return axios.put(API + `/api/latexCollection/key`, latexEntry, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  getLatexCollection: function () {
    return axios.get(API + "/api/latexCollection");
  },
  getCashEntryPerCustomer: function (customerId) {
    return axios.get(API + "/api/cashPayment/key?customerId=" + customerId);
  },
  getCustomer: function (customerId) {
    return axios.get(API + "/api/newcustomer/" + customerId);
  },
  getLatexCollectionPerCustomer: function (customerId) {
    return axios.get(API + "/api/latexCollection/key?customerId=" + customerId);
  },
  calculateInvoiceAmount: function (invoiceReq) {
    return axios.post(API + `/api/calculateInvoiceAmount`, invoiceReq, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  generateInvoices: function (billToDate) {
    return axios.put(
      API + `/api/invoiceGeneration/generateInvoiceForCustomer`,
      billToDate,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  applyRate: function (invoiceReq) {
    return axios.post(API + `/api/applyRate`, invoiceReq, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  loadOptions: async (inputText, callback) => {
    const response = await fetch(
      API + `/api/newcustomer/search?searchString=${inputText}`
    );
    const json = await response.json();

    callback(json.map((i) => ({ label: i.customerName, value: i.customerId })));
  },
  getCashEntry: function () {
    return axios.get(API + "/api/cashPayment");
  },
  updateCashEntry: function (cashEntry) {
    return axios.put(API + `/api/cashPayment/key`, cashEntry, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getBillingHistory: function () {
    return axios.get(API + "/api/billingSummary");
  },
  uploadInvoicesToAws: function (files) {
    return axios.post(API + `/api/upload`, files, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  downloadInvoices: function (req) {
    return axios.post(API + `/api/print/download`, req, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  isUserLoggedIn: function () {
    return axios.get(API + "/api/login/checksession");
  },
  sendEmail: function (emailData) {
    return axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      emailData,
      {
        headers: {
          contentType: "application/json",
        },
      }
    );
  },
  calculateNetDue: function () {
    return axios.post(API + `/api/netdueCalc`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
