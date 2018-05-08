import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const podiumColors = {
  1: '#fdd530',
  2: '#cccccc',
  3: '#cb7f3b',
}

class Scores extends Component {
  static propTypes = {
    scores: ImmutablePropTypes.list.isRequired,
    loggedUserId: PropTypes.string.isRequired,
  }

  renderPosition = (position) => {
    if (position <= 3) {
      return (
        <i
          className={`fas fa-trophy`}
          style={{ color: podiumColors[position] }}
        />
      );
    }

    return `${position}°`;
  }

  render() {
    const { loggedUserId, scores } = this.props;

    return [
      <h2 key="title" className="title">{"Scores"}</h2>,

      <ListGroup key="scores" style={{ textAlign: 'left' }}>
        {scores.map((score, index) => (
          <ListGroupItem
            key={score.get('name')}
            bsStyle={loggedUserId === score.get('userId') ? 'info' : 'default'}
          >
            {this.renderPosition(index + 1)}
            {` ${score.get('name')}`}
            <span style={{ float: 'right' }}>
              {`${score.get('score')} pt.`}
            </span>
          </ListGroupItem>
        ))}
      </ListGroup>
    ];
  }
}

const mapStateToProps = state => ({
  loggedUserId: state.getIn(['user', 'profile', 'id'])
});

export default connect(mapStateToProps)(Scores);