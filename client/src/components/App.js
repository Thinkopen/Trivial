import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import styled from 'styled-components';
import { Grid, Panel } from 'react-bootstrap';

import LoginContainer from './LoginContainer';
import LoggedContainer from './LoggedContainer';

import { setUser } from '../actions/user';


const Container = styled(Grid)`
  text-align: center;
  height: 100vh;
`;

const PanelContainer = styled(Panel)`
  padding: 25px;
  overflow: auto;
  background-color: rgba(255, 255, 255, .8);
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  height: 95%;
`;


class App extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    userLogged: PropTypes.bool.isRequired,
    setUser: PropTypes.func.isRequired,
  }

  handleLoginResponse = (data) => {
    this.props.setUser(data);
  }

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
              <LoginContainer
                facebookClientId={settings.get('facebookClientId')}
                handleLoginResponse={this.handleLoginResponse}
              />
            :
              <LoggedContainer />
          : <p>{'Loading configurations..'}</p>}
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
