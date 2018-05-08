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
  static getInstance(io, roomId) {
    SocketQuiz.rooms = SocketQuiz.rooms || {};

    if (!SocketQuiz.rooms[roomId]) {
      SocketQuiz.rooms[roomId] = new SocketQuiz(io, roomId);
    }

    return SocketQuiz.rooms[roomId];
  }

  constructor(io, roomId) {
    this.io = io.to(roomId);
    this.roomId = roomId;
  }

  async handleConnect(socket) {
    const isAdmin = socket.handshake.query.admin === '1';

    if (isAdmin && !socket.request.user.admin) {
      socket.emit('invalid admin user');
      socket.disconnect(true);

      return;
    }

    socket.join(this.roomId);

    socket.on('start quiz', () => this.handleStart(socket));
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

  async handleStart(socket) {
    const questions = await Question.findAll({
      limit: config.get('quiz.questionsCount'),
      order: sequelize.random(),
    });

    await this.room.removeUser(socket.request.user);
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

    this.io.emit('question', this.question);

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

    this.io.emit('score', score);
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

    this.question.tmpUsers = this.question.tmpUsers || [];
    this.question.tmpUsers.push(socket.request.id);

    if (this.question.tmpUsers.length === this.room.users.length) {
      clearTimeout(this.nextQuestionTimeout);

      await this.emitNextQuestion();
    }
  }
}

class SocketQuizController extends AbstractController {
  initRouter() {
    const ioRooms = this.io.of('rooms');

    ioRooms.use(jwtAuth.authenticate({ secret: jwt.secretOrKey }, jwt.handlePayload));

    ioRooms.on('connect', (socket) => {
      socket.on('join', roomId => SocketQuiz.getInstance(ioRooms, roomId).handleConnect(socket));
    });
  }
}

module.exports = SocketQuizController;
