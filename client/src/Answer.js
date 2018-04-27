import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { postAnswer } from './actions/room';

class Answer extends Component {
  static propTypes = {
    questionId: PropTypes.string.isRequired,
    answer: ImmutablePropTypes.map.isRequired,
    postAnswer: PropTypes.func.isRequired,
  }

  handleClick = (payload) => () => {
    this.props.postAnswer(payload);
  }

  render() {
    const { questionId, answer } = this.props;
    const answerId = answer.get('id');
    const text = answer.get('text');
    const correct = answer.get('correct');

    return <button onClick={this.handleClick({ questionId, answerId })}>{text}</button>;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  postAnswer: bindActionCreators(postAnswer, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Answer);
