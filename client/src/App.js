import React, { Component } from 'react';
import FacebookProvider, { Login } from 'react-facebook';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <FacebookProvider appId="355272948314470">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <Login
            scope="email"
            onResponse={this.handleResponse}
            onError={this.handleError}
            render={({ isLoading, isWorking, onClick }) => (
              <button onClick={onClick}>
                Login via Facebook
                {(isLoading || isWorking) && (
                  <span>Loading...</span>
                )}
              </button>
          )}
          />
        </div>
      </FacebookProvider>
    );
  }
}

export default App;
