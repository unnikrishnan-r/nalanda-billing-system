import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Addcustomer from "./pages/CustomerAdd";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    // React router Component
    <Router>
      <div>
        {/* Used to select which routes to take */}
        <Switch>
          {/* To render a component depending on the URL exact path hit in the browser*/}
          <Route exact path="/" component={MainPage} />
          <Route exact path="/addcustomer" component={Addcustomer} />
        </Switch>
      </div>
    </Router>
  );
}
// Exporting App function
export default App;