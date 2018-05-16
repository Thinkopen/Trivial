import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login';

class LoginContainer extends Component {
  static propTypes = {
    facebookClientId: PropTypes.string.isRequired,
    handleLoginResponse: PropTypes.func.isRequired,
  }

  handleLoginResponse = (data) => {
    this.props.handleLoginResponse(data);
  }

  render() {
    const { facebookClientId } = this.props;

    return [
      <FacebookLogin
        autoLoad
        appId={facebookClientId}
        fields="name,email,picture"
        icon="fa-facebook"
        callback={this.handleLoginResponse}
        className="go-bottom"
      />
    ];
  }
}

export default LoginContainer;
