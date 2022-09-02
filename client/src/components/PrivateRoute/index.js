import React from "react";
import {
  Route,
  Redirect,
  withRouter // ** important so that history is availabe
} from "react-router-dom";

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      loaded: false
    };
  }

  componentDidMount() {
    this.checkIsLogged();
  }

  checkIsLogged = () => {
    this.setState({
      isLoggedIn : sessionStorage.getItem("UserId") ? true : false,
      loaded : true

    })
    console.log(sessionStorage.getItem("UserId"))
  };

  render() {
    const { component: Component, ...rest } = this.props;
    const currentLocation = this.props.location.pathname;

    if (!this.state.loaded) {
      return null;
    }

    return (
      <Route
        {...rest}
        render={props => {
          return this.state.isLoggedIn === true ? (
            <Component
              {...props}
              isLoggedIn={this.state.isLoggedIn}
            />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: currentLocation }
              }}
            />
          );
        }}
      />
    );
  }
}

export default withRouter(PrivateRoute);
