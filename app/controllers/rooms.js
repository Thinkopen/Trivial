const jwt = require('../libraries/jwt');

const Room = require('../models/room');

const AbstractController = require('.');

class RoomsController extends AbstractController {
  initRouter() {
    this.router.get('/active', jwt.authenticate(), (request, response) => RoomsController.retrieveActive(request, response));
  }

  static async retrieveActive(request, response) {
    let room = await Room.scope('active').findOne();

    if (!room) {
      room = await Room.create();
    }

    response.json(room);
  }
}

module.exports = RoomsController;
