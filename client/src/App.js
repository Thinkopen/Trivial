import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import FacebookProvider, { Login } from 'react-facebook';

import { setUser } from './actions/user';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    setUser: PropTypes.func.isRequired,
  }

  handleResponse = (data) => {
    console.log('response', data);
    this.props.setUser(data);
  }
  handleError = (error) => {
    console.log('error', error);
  }

  renderLoginButton = ({ isLoading, isWorking, onClick }) => (
    <button onClick={onClick}>
      {
        (isLoading || isWorking)
        ? <span>{'Loading...'}</span>
        : <span>{'Login via Facebook'}</span>
      }
    </button>
  )

  render() {
    const { isLoading: settingsIsLoading, settings } = this.props;

    if (!settingsIsLoading) {
      return (
        <FacebookProvider appId={settings.get('facebookClientId')}>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">{'Welcome to React'}</h1>
            </header>
            <Login
              scope="email"
              onResponse={this.handleResponse}
              onError={this.handleError}
              render={this.renderLoginButton}
            />
          </div>
        </FacebookProvider>
      );
    } else {
      return <p>{'Is Loading'}</p>;
    }
  }
}

const mapStateToProps = store => ({
  isLoading: store.get('settings').get('loading'),
  settings: store.get('settings').get('data') || Map(),
});

const mapDispatchToProps = dispatch => ({
  setUser: bindActionCreators(setUser, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
