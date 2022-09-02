import React from "react";
import {
  Route,
  withRouter // ** important so that history is availabe
} from "react-router-dom";

class PublicRoute extends React.Component {
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
  };

  render() {
    const { component: Component, ...rest } = this.props;

    if (!this.state.loaded) {
      return null;
    }

    return (
      <Route
        {...rest}
        render={props => {
          return (
            <Component
              {...props}
              isLoggedIn={this.state.isLoggedIn}
            />
          );
        }}
      />
    );
  }
}

export default withRouter(PublicRoute);
