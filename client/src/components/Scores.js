import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class Scores extends Component {
  static propTypes = {
    scores: ImmutablePropTypes.list.isRequired,
  }

  render() {
    return [
      <h2 key="title" className="title">{"Scores"}</h2>,

      <ListGroup key="scores" style={{ textAlign: 'left' }}>
        {this.props.scores.map(score => (
          <ListGroupItem key={score.get('name')}>
            {score.get('name')}
            <span style={{ float: 'right' }}>
              {`${score.get('score')} pt.`}
            </span>
          </ListGroupItem>
        ))}
      </ListGroup>
    ];
  }
}

export default Scores;
