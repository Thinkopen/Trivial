const config = require('config');

const { sequelize } = require('../../libraries/db');

const Answer = require('../../models/answer');
const Question = require('../../models/question');
const Room = require('../../models/room');
const RoomQuestion = require('../../models/roomQuestion');

const AbstractController = require('..');

class SocketQuiz {
  static get roomNameRegex() { return /^\/room-(.+)$/; }

  static parseRoomInfo(name) {
    const [, roomId] = SocketQuiz.roomNameRegex.exec(name);

    return { roomId };
  }

  static getInstance(socket) {
    SocketQuiz.rooms = SocketQuiz.rooms || {};

    const { roomId } = SocketQuiz.parseRoomInfo(socket.nsp.name);

    if (!SocketQuiz.rooms[roomId]) {
      SocketQuiz.rooms[roomId] = new SocketQuiz(socket, roomId);
    }

    return SocketQuiz.rooms[roomId];
  }

  constructor(socket, roomId) {
    this.namespace = socket.nsp;
    this.roomId = roomId;
  }

  async handleConnect(socket) {
    socket.on('start quiz', () => this.handleStart());
    socket.on('answer', payload => this.handleAnswer(socket, payload));

    await this.fetchRoom();

    if (!this.room) {
      socket.emit('invalid room id');
      socket.disconnect(true);

      delete SocketQuiz.rooms[this.roomId];
    }
  }

  async fetchRoom() {
    this.room = await Room.findOne({
      where: { id: this.roomId },
      include: [{
        model: Question,
        through: RoomQuestion,
        include: [{ model: Answer }],
      }],
    });
  }

  async handleStart() {
    const questions = await Question.findAll({
      limit: 10,
      order: sequelize.random(),
    });

    await this.room.setStarted();

    await Promise.all(questions.map((question, index) => this.room.addQuestion(question, { through: { order: index } })));

    await this.fetchRoom();
    this.nextQuestion = 0;

    this.emitNextQuestion();
  }

  emitNextQuestion() {
    if (this.nextQuestion >= this.room.questions.length) {
      this.emitScore();

      return;
    }

    this.namespace.emit('question', this.room.questions[this.nextQuestion]);
    this.nextQuestion += 1;

    this.nextQuestionTimeout = setTimeout(() => this.emitNextQuestion(), config.get('quiz.nextQuestionTimeout'));
  }

  emitScore() {
    this.namespace.emit('score', this.room);
  }

  handleAnswer(socket, { questionId, answerId }) {
    const question = this.room.questions.find(tmpQuestion => tmpQuestion.id === questionId);

    if (!question) {
      socket.emit('invalid question id');
      return;
    }

    const answer = question.answers.find(tmpAnswer => tmpAnswer.id === answerId);

    if (!answer) {
      socket.emit('invalid answer id');
      return;
    }

    console.log('QUESTION:', question.text);
    console.log('ANSWER:', answer.text);
  }
}

class SocketQuizController extends AbstractController {
  initRouter() {
    this.io.of(SocketQuiz.roomNameRegex)
      .on('connect', socket => SocketQuiz.getInstance(socket).handleConnect(socket));
  }
}

module.exports = SocketQuizController;
