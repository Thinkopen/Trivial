import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login-component';

class LoginContainer extends Component {
  static propTypes = {
    facebookClientId: PropTypes.string.isRequired,
    googleClientId: PropTypes.string.isRequired,
    handleLoginResponse: PropTypes.func.isRequired,
  }

  handleLoginResponse = (data) => {
    console.log('DATA', data);
    this.props.handleLoginResponse(data);
  }

  render() {
    const { facebookClientId, googleClientId } = this.props;

    return [
      <FacebookLogin
        autoload={false}
        appId={facebookClientId}
        fields="name,email,picture"
        icon="fa-facebook"
        callback={this.handleLoginResponse}
        className="go-bottom"
      />,
      <GoogleLogin
        socialId={googleClientId}
        className="google-login"
        scope="profile"
        prompt="select_account"
        fetchBasicProfile={false}
        responseHandler={this.handleLoginResponse}
        buttonText="Login With Google"
      />,
    ];
  }
}

export default LoginContainer;
