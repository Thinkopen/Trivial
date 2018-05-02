import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Transition } from 'react-transition-group';

import Question from './Question';
import Scores from './Scores';

import { getRoom } from '../actions/room';
import { startQuiz } from '../actions/quiz';

import '../index.css';

class LoggedContainer extends Component {
  static propTypes = {
    user: ImmutablePropTypes.map.isRequired,
    room: ImmutablePropTypes.map.isRequired,
    quiz: ImmutablePropTypes.map.isRequired,
    getRoom: PropTypes.func.isRequired,
    startQuiz: PropTypes.func.isRequired,
  }

  joinRoom = () => { this.props.getRoom(); }
  startQuiz = () => { this.props.startQuiz(); }

  // renderJoinRoom = () => (
  //   <Transition in={} timeout={{
  //     enter: 0,
  //     exit: duration
  //   }}>
  //     {
  //       (status) => {
  //         // Don't render anything if component has "exited".
  //         if (status === 'exited') {
  //           return null
  //         }
  //         return (
  //           <div>
  //             <h2>{`Welcome ${this.props.user.get('name')}`}</h2>
  //             <Button onClick={this.joinRoom}>{'Join room'}</Button>
  //           </div>
  //         );
  //       }
  //     }
  //   </Transition>
  // );

  render() {
    const { room, user, quiz } = this.props;
    const questions = quiz.get('questions');
    const scores = quiz.get('scores');

    if (!room.get('id')) {
      return (
        <div>
          <h2>{`Welcome ${this.props.user.get('name')}`}</h2>
          <Button onClick={this.joinRoom}>{'Join room'}</Button>
        </div>
      );
    } else if (user.get('admin')) {
      return <button onClick={this.startQuiz}>{'Start questions'}</button>;
    } else if (scores.size) {
      return <Scores scores={scores} />
    } else if (questions.size) {
      return <Question question={questions.last()} />
    }

    return <span>{'Wait for start'}</span>
  }
}

const mapStateToProps = store => ({
  user: store.get('user').get('profile'),
  room: store.get('room').get('data'),
  quiz: store.get('quiz'),
});

const mapDispatchToProps = dispatch => ({
  getRoom: bindActionCreators(getRoom, dispatch),
  startQuiz: bindActionCreators(startQuiz, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggedContainer);
