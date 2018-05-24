import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import styled from 'styled-components';

const podiumColors = {
  1: '#fdd530',
  2: '#cccccc',
  3: '#cb7f3b',
}

// const UserImage = styled.img`
//   height: 40px;
//   border-radius: 20px;
//   margin: 0 10px;
// `;

const PtContainer = styled.span`
  float: right;
`;

class Scores extends Component {
  static propTypes = {
    scores: ImmutablePropTypes.list.isRequired,
    loggedUserId: PropTypes.string.isRequired,
    userPicture: PropTypes.string.isRequired,
  }

  renderPosition = (position) => {
    if (position <= 3) {
      return (
        <i
          className={'fas fa-trophy'}
          style={{ color: podiumColors[position] }}
        />
      );
    }

    return `${position}°`;
  }

  render() {
    // const { loggedUserId, userPicture, scores } = this.props;
    const { loggedUserId, scores } = this.props;

    return [
      <h2 key="title" className="title">{"Scores"}</h2>,

      <ListGroup key="scores" style={{ textAlign: 'left' }}>
        {scores
          .sortBy(score => -score.get('score'))
          .map((score, index) => (
          <ListGroupItem
            key={score.get('name')}
            bsStyle={loggedUserId === score.get('userId') ? 'info' : 'default'}
          >
            {this.renderPosition(index + 1)}
            {/* <UserImage src={userPicture} /> */}
            {` ${score.get('name')}`}
            <PtContainer>{`${score.get('score')} pt.`}</PtContainer>
          </ListGroupItem>
        ))}
      </ListGroup>
    ];
  }
}

const mapStateToProps = state => ({
  loggedUserId: state.getIn(['user', 'profile', 'id']),
  userPicture: state.getIn(['user', 'profile', 'picture']),
});

export default connect(mapStateToProps)(Scores);
