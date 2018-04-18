const config = require('config');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/user');

class JwtAuth {
  constructor() {
    this.expiresIn = config.get('jwt.expiresIn');
    this.secretOrKey = config.get('jwt.secret');

    this.initJwtPassport();
  }

  initJwtPassport() {
    passport.use(new JwtStrategy({
      secretOrKey: this.secretOrKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, this.handlePayload));
  }

  sign(user) {
    return jwt.sign(user instanceof User ? user.toJSON() : user, this.secretOrKey, {
      expiresIn: this.expiresIn,
    });
  }

  verify(token) {
    return jwt.verify(token, this.secretOrKey);
  }

  // eslint-disable-next-line class-methods-use-this
  handlePayload(payload, done) {
    User.findOne({ where: { id: payload.id } })
      .then((user) => {
        if (!user) {
          return done(null, false, 'user does not exist');
        }

        return done(null, user);
      })
      .catch(/* istanbul ignore next */ error => done(error));
  }

  // eslint-disable-next-line class-methods-use-this
  authenticate() {
    return passport.authenticate('jwt', { failWithError: true });
  }
}

module.exports = new JwtAuth();
