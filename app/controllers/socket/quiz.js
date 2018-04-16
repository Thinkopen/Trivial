const config = require('config');
const moment = require('moment');
const jwtAuth = require('socketio-jwt-auth');

const { sequelize } = require('../../libraries/db');
const jwt = require('../../libraries/jwt');

const Answer = require('../../models/answer');
const Question = require('../../models/question');
const Room = require('../../models/room');
const RoomQuestion = require('../../models/roomQuestion');
const User = require('../../models/user');

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
    const isAdmin = socket.handshake.query.admin === '1';

    if (isAdmin && !socket.request.user.admin) {
      socket.emit('invalid admin user');
      socket.disconnect(true);

      return;
    }

    socket.on('start quiz', () => this.handleStart());
    socket.on('answer', payload => this.handleAnswer(socket, payload));

    await this.fetchRoom();

    if (!this.room) {
      socket.emit('invalid room id');
      socket.disconnect(true);

      delete SocketQuiz.rooms[this.roomId];

      return;
    }

    if (!isAdmin && !this.room.users.some(user => user.id === socket.request.user.id)) {
      await this.room.addUser(socket.request.user);
      await this.fetchRoom();
    }
  }

  async fetchRoom() {
    const conditions = {
      where: { id: this.roomId },
      include: [{
        model: Question,
        through: RoomQuestion,
        include: [{ model: Answer }],
      }, {
        model: User,
      }],
    };

    if (this.room) {
      await this.room.reload(conditions);
    } else {
      this.room = await Room.findOne(conditions);
    }
  }

  async handleStart() {
    const questions = await Question.findAll({
      limit: 10,
      order: sequelize.random(),
    });

    await this.room.setStarted();

    await Promise.all(questions.map((question, index) => this.room.addQuestion(question, { through: { order: index } })));

    await this.fetchRoom();
    this.nextQuestion = -1;

    await this.emitNextQuestion();
  }

  get question() {
    return this.room.questions[this.nextQuestion];
  }

  async emitNextQuestion() {
    this.nextQuestion += 1;

    if (!this.question) {
      await this.emitScore();

      return;
    }

    await this.question.roomQuestion.setStarted();

    this.namespace.emit('question', this.question);

    this.nextQuestionTimeout = setTimeout(() => this.emitNextQuestion(), config.get('quiz.nextQuestionTimeout'));
  }

  async emitScore() {
    await this.fetchRoom();

    await Promise.all(this.room.users.map(user => user.roomUser.calculate()));

    const score = this.room.users
      .map(user => ({
        name: user.name,
        score: user.roomUser.score,
      }))
      .sort((a, b) => a.score - b.score);

    this.namespace.emit('score', score);
  }

  async handleAnswer(socket, { questionId, answerId }) {
    if (this.question.id !== questionId) {
      socket.emit('invalid question id');
      return;
    }

    const answer = this.question.answers.find(tmpAnswer => tmpAnswer.id === answerId);

    if (!answer) {
      socket.emit('invalid answer id');
      return;
    }

    const answeredAfter = moment().diff(this.question.startedAt);

    await this.room.users
      .find(user => user.id === socket.request.user.id)
      .roomUser
      .addAnswer(answer, { through: { answeredAfter } });
  }
}

class SocketQuizController extends AbstractController {
  initRouter() {
    const room = this.io.of(SocketQuiz.roomNameRegex);

    room.use(jwtAuth.authenticate({ secret: jwt.secretOrKey }, jwt.handleJwt));

    room.on('connect', socket => SocketQuiz.getInstance(socket).handleConnect(socket));
  }
}

module.exports = SocketQuizController;
