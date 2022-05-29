import axios from "axios";

export default {
  getCustomerList: function () {
    return axios.get("https://nalandaapi.herokuapp.com/api/newcustomer");
  },
  getLatexCollection: function () {
    return axios.get("https://nalandaapi.herokuapp.com/api/latexCollection")

  }
};

