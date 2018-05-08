import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import { postAnswer } from '../actions/quiz';

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

  handleClick = (payload) => () => {
    this.props.postAnswer(payload);
  }

  render() {
    const { questionId, answer, readOnly } = this.props;
    const answerId = answer.get('id');
    const text = answer.get('text');

    return (
      <ButtonFull
        onClick={this.handleClick({ questionId, answerId })}
        disabled={readOnly}
      >
        {text}
      </ButtonFull>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  postAnswer: bindActionCreators(postAnswer, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Answer);
