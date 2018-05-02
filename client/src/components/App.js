import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import FacebookLogin from 'react-facebook-login';
import styled from 'styled-components';
import { Grid, Panel } from 'react-bootstrap';

import LoggedContainer from './LoggedContainer';

import { setUser } from '../actions/user';


const Container = styled(Grid)`
  text-align: center;
  margin-top: 50px;
`;

const PanelContainer = styled(Panel)`
  padding: 25px;
`;


class App extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    userLogged: PropTypes.bool.isRequired,
    setUser: PropTypes.func.isRequired,
  }

  handleResponse = (data) => { this.props.setUser(data); }

  render() {
    const {
      isLoading: settingsIsLoading,
      settings,
      userLogged,
    } = this.props;

      return (
        <Container>
          <PanelContainer>
            {!settingsIsLoading ?
              !userLogged ?
                <FacebookLogin
                  autoLoad
                  appId={settings.get('facebookClientId')}
                  fields="name,email,picture"
                  icon="fa-facebook"
                  callback={this.handleResponse}
                />
              :
                <LoggedContainer />
            : <p>{'Loading configurations..'}</p>
          }
        </PanelContainer>
      </Container>
    );
  }
}


const mapStateToProps = store => ({
  isLoading: store.get('settings').get('loading'),
  settings: store.get('settings').get('data') || new Map(),
  userLogged: store.get('user').get('logged'),
});

const mapDispatchToProps = dispatch => ({
  setUser: bindActionCreators(setUser, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
