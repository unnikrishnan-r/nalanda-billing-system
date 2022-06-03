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
  getLatexCollection: function () {
    return axios.get("https://nalandaapi.herokuapp.com/api/latexCollection")

  }
};

