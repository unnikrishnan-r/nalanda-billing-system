// Importing all the components
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import CashPayments from "./pages/CashPayments";
import BillingInvoices from "./pages/BillingInvoice";

import LatexCollection from "./pages/LatexCollection";
import "bootstrap/dist/css/bootstrap.min.css";
import SpecificCustomer from "./pages/SpecificCustomer";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    // React router Component
    <Router>
      <div>
        {/* Used to select which routes to take */}
        <Switch>
          {/* To render a component depending on the URL exact path hit in the browser*/}
          <PublicRoute exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />

          <PrivateRoute exact path="/customer" component={MainPage} />

          <PrivateRoute exact path="/cashpayment" component={CashPayments} />
          <PrivateRoute
            exact
            path="/latexCollection"
            component={LatexCollection}
          />
          <PrivateRoute
            exact
            path="/billingInvoices"
            component={BillingInvoices}
          />
          <PrivateRoute
            exact
            path="/specificUser/:customerId"
            component={SpecificCustomer}
          />
        </Switch>
      </div>
    </Router>
  );
}

// Exporting App function
export default App;
