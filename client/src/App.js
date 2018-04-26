import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import { setUser } from './actions/user';
import { getRoom } from './actions/room';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    userLogged: PropTypes.bool.isRequired,
    setUser: PropTypes.func.isRequired,
    getRoom: PropTypes.func.isRequired,
  }

  handleResponse = (data) => { this.props.setUser(data); }

  joinRoom = () => { this.props.getRoom(); }

  renderLoginButton = ({ onClick, isProcessing }) => {
    return (
      <button onClick={onClick}>
        {
          (isProcessing)
          ? <span>{'Loading...'}</span>
          : <span>{'Login via Facebook'}</span>
        }
      </button>
    )
  }

  render() {
    const { isLoading: settingsIsLoading, settings, userLogged } = this.props;

    if (!settingsIsLoading) {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">{'Welcome to React'}</h1>
          </header>
          {!userLogged ?
            <FacebookLogin
              autoLoad
              appId={settings.get('facebookClientId')}
              fields="name,email,picture"
              callback={this.handleResponse}
              render={this.renderLoginButton}
            />
          : <button onClick={this.joinRoom}>{'Join room'}</button>}
        </div>
      );
    } else {
      return <p>{'Loading configurations..'}</p>;
    }
  }
}

const mapStateToProps = store => ({
  isLoading: store.get('settings').get('loading'),
  settings: store.get('settings').get('data') || new Map(),
  userLogged: store.get('user').get('logged'),
});

const mapDispatchToProps = dispatch => ({
  setUser: bindActionCreators(setUser, dispatch),
  getRoom: bindActionCreators(getRoom, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
