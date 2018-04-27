import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

class Scores extends Component {
  static propTypes = {
    scores: ImmutablePropTypes.list.isRequired,
  }

  render() {
    return this.props.scores.map(score => <p>{`${score.get('name')} - ${score.get('score')}pt.`}</p>);
  }
}

export default Scores;
