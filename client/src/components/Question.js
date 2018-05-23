import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from "styled-components";
import { Panel, ProgressBar } from 'react-bootstrap';
import renderHTML from 'react-render-html';

import Countdown from './Countdown';
import Answer from './Answer';

import { postAnswer } from '../actions/quiz';

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
    postAnswer: PropTypes.func.isRequired,
  }

  static defaultProps = {
    answeredQuestions: 0,
  }

  constructor() {
    super();

    this.state = { answered: false };
  }

  componentDidUpdate({ currentQuestion: nextCurrentQuestion }) {
    const nextQuestionId = nextCurrentQuestion.get('id');
    const questionId = this.props.currentQuestion.get('id');

    nextQuestionId !== questionId && this.setState({
      answered: false
    });
  }

  postAnswer = (payload) => {
    this.setState({ answered: true });
    this.props.postAnswer(payload);
  }

  filterAnswer = answer => answer.get('text')

  render() {
    const {
      currentQuestion,
      answeredQuestions,
      totalQuestions,
      timeoutQuestion,
      isAdmin,
    } = this.props;
    const { answered } = this.state;
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
        {answered && <p>{'Aspetta che tutti abbiano risposto'}</p>}
        {answers.filter(this.filterAnswer).map(answer => (
          <Answer
            key={answer.get('id')}
            questionId={questionId}
            answer={answer}
            postAnswer={this.postAnswer}
            readOnly={isAdmin || answered}
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

const mapDispatchToProps = dispatch => ({
  postAnswer: bindActionCreators(postAnswer, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
