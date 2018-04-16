const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

class Auth {
  constructor() {
    this.expiresIn = config.get('jwt.expiresIn');
    this.secretOrKey = config.get('jwt.secret');
  }

  sign(user) {
    return jwt.sign(user instanceof User ? user.toJSON() : user, this.secretOrKey, {
      expiresIn: this.expiresIn,
    });
  }

  verify(token) {
    return jwt.verify(token, this.secretOrKey);
  }
}

module.exports = new Auth();
