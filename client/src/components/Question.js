import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { Panel, ProgressBar } from 'react-bootstrap';
import renderHTML from 'react-render-html';

import Answer from './Answer';

const PanelStyled = styled(Panel)`
  text-align: left;
  padding: 10px 20px;
  margin-bottom: 40px;
`;

class Question extends Component {
  static propTypes = {
    currentQuestion: ImmutablePropTypes.map.isRequired,
    answeredQuestions: PropTypes.number,
    totalQuestions: PropTypes.number.isRequired,
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
      isAdmin,
    } = this.props;
    const id = currentQuestion.get('id');
    const text = currentQuestion.get('text').replace(/\\n/g, '<br/>');
    const answers = currentQuestion.get('answers');

    return (
      <div>
        <PanelStyled>
          <h4><b>{`Question ${answeredQuestions}`}</b></h4>
          <ProgressBar
            now={answeredQuestions * 100 / totalQuestions}
            style={{ height: 10 }}
          />
          <p>{renderHTML(text)}</p>
        </PanelStyled>
        {answers.map(answer => (
          <Answer
            key={answer.get('id')}
            questionId={id}
            answer={answer}
            readOnly={isAdmin}
          />
        ))}
      </div>
    );
  }
}

export default Question;
