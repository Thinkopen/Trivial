import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from "styled-components";
import { Panel, ProgressBar } from 'react-bootstrap';
import renderHTML from 'react-render-html';

import Countdown from './Countdown';
import Answer from './Answer';

const PanelStyled = styled(Panel)`
  text-align: left;
  padding: 10px 20px;
  margin-bottom: 40px;
`;

const QuestionCounter = styled.h4`
  font-weight: bold;
  color: #377BB5;
`;

class Question extends Component {
  static propTypes = {
    currentQuestion: ImmutablePropTypes.map.isRequired,
    answeredQuestions: PropTypes.number,
    totalQuestions: PropTypes.number.isRequired,
    timeoutQuestion: PropTypes.number.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    answeredQuestions: 0,
  }

  render() {
    const {
      currentQuestion,
      answeredQuestions,
      totalQuestions,
      timeoutQuestion,
      isAdmin,
    } = this.props;
    const questionId = currentQuestion.get('id');
    const text = currentQuestion.get('text').replace(/\\n/g, '<br/>');
    const answers = currentQuestion.get('answers');

    return (
      <div>
        <PanelStyled>
          <QuestionCounter>{`Question ${answeredQuestions}`}</QuestionCounter>
          <Countdown
            questionId={questionId}
            timeout={timeoutQuestion}
          />
          <ProgressBar
            now={answeredQuestions / totalQuestions * 100}
            style={{ height: 10 }}
          />
          <p>{renderHTML(text)}</p>
        </PanelStyled>
        {answers.map(answer => (
          <Answer
            key={answer.get('id')}
            questionId={questionId}
            answer={answer}
            readOnly={isAdmin}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  timeoutQuestion: state.getIn([
    'settings',
    'data',
    'quiz',
    'nextQuestionTimeout',
  ]),
  totalQuestions: state.getIn([
    'settings',
    'data',
    'quiz',
    'questionsCount',
  ]),
});

export default connect(mapStateToProps)(Question);
