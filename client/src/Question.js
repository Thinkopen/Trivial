import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Answer from './Answer';

class Question extends Component {
  static propTypes = {
    question: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const { question } = this.props;
    const id = question.get('id');
    const text = question.get('text');
    const answers = question.get('answers');

    return (
      <div>
        <p>{question.get('text')}</p>
        {answers.map(answer => (
          <Answer
            questionId={id}
            answer={answer}
          />
        ))}
      </div>
    );
  }
}

export default Question;
