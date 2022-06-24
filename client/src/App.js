// Importing all the components
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainPage from "./pages/MainPage";
import  CashPayments from "./pages/CashPayments"
import BillingInvoices from "./pages/BillingInvoice"

import LatexCollection from "./pages/LatexCollection";
import "bootstrap/dist/css/bootstrap.min.css";
import SpecificCustomer from "./pages/SpecificCustomer";

function App() {
  return (
    // React router Component
    <Router>
      <div>
        {/* Used to select which routes to take */}
        <Switch>
          {/* To render a component depending on the URL exact path hit in the browser*/}
          <Route exact path="/" component={MainPage} />
          <Route exact path="/home" component={MainPage} />
          <Route exact path="/cashpayment" component={CashPayments} />
          <Route exact path="/latexCollection" component={LatexCollection} />
          <Route exact path="/billingInvoices" component={BillingInvoices} />
          <Route exact path="/specificUser" component={SpecificCustomer}/>
        </Switch>
      </div>
    </Router>
  );
}

// Exporting App function
export default App;
