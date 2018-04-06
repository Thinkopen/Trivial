const Room = require('../../models/room');

const AbstractController = require('..');

class SocketQuiz {
  static get roomNameRegex() { return /^\/room-(.+)$/; }

  constructor(socket) {
    this.socket = socket;
    this.namespace = this.socket.nsp;

    [, this.roomId] = SocketQuiz.roomNameRegex.exec(this.namespace.name);

    this.socket.on('answer', (questionId, answer) => this.handleAnswer(questionId, answer));

    this.getRoom()
      .then((room) => {
        if (!room) {
          this.socket.emit('invalid room id');
          this.socket.disconnect(true);
        }
      });
  }

  async getRoom() {
    if (!this.room) {
      this.room = await Room.findOne({
        where: { id: this.roomId },
      });
    }

    return this.room;
  }

  handleAnswer(questionId, answer) {
    console.log(questionId);
    console.log(answer);
  }
}

class SocketQuizController extends AbstractController {
  initRouter() {
    this.io.of(SocketQuiz.roomNameRegex).on('connect', socket => new SocketQuiz(socket));
  }
}

module.exports = SocketQuizController;
