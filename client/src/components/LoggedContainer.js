import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Well } from 'react-bootstrap';

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

  render() {
    const { room, user, quiz } = this.props;
    const questions = quiz.get('questions');
    const scores = quiz.get('scores');

    if (!room.get('id')) {
      return (
        <div>
          <h2 className="title">{`Benvenuto ${this.props.user.get('name')}`}</h2>
          <Well style={{ fontSize: '1.2em' }}>
            {'Sei pronto a giocare con la nostra App e sfidare gli altri concorrenti rispondendo - correttamente e nel minor tempo possibile - agli impossibili quesiti di logica e matematica che abbiamo in serbo per te?'}
          </Well>
          <Button
            className="go-bottom"
            onClick={this.joinRoom}
            bsSize="large"
          >
            {'Unisciti ai partecipanti'}
          </Button>
        </div>
      );
    } else if (scores.size) {
      return <Scores scores={scores} />;
    } else if (questions.size) {
      return (
        <Question
          currentQuestion={questions.last()}
          answeredQuestions={questions.size}
          isAdmin={user.get('admin')}
        />
      );
    }

    return [
      <div key="loading">
        <Well>
          {`10 domande
          20 secondi per rispondere
          fino a 20 concorrenti per match`}
          <br />
          <br />
          <i>{'Adrenalina a pacchi'}</i>
          <br />
          <br />
          {`classifica dei giocatori in real-time
          1 gadget premio per il vincitore`}
          <br />
          <br />
          <big><b><i>{'Pronto?!'}</i></b></big>
        </Well>
      </div>,
      user.get('admin') && <Button
        key="start"
        onClick={this.startQuiz}
        bsSize="large"
      >
        {'Start quiz'}
      </Button>,
    ];
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
