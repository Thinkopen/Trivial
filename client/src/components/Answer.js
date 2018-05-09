import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

const ButtonFull = styled(Button)`
  width: 80%;
  margin-bottom: 20px;
  font-size: 1.15em;
`;

class Answer extends Component {
  static propTypes = {
    questionId: PropTypes.string.isRequired,
    answer: ImmutablePropTypes.map.isRequired,
    postAnswer: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
  }

  constructor() {
    super();

    this.state = { answered: false };
  }

  handleClick = payload => () => {
    this.setState({ answered: true });
    this.props.postAnswer(payload);
  }

  render() {
    const { questionId, answer, readOnly } = this.props;
    const answerId = answer.get('id');
    const text = answer.get('text');

    return (
      <ButtonFull
        onClick={this.handleClick({ questionId, answerId })}
        bsStyle={this.state.answered ? 'primary' : 'default'}
        disabled={readOnly}
      >
        {text}
      </ButtonFull>
    );
  }
}

export default Answer;
