const config = require('config');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const User = require('../../models/user');

class JwtAuth {
  constructor() {
    this.expiresIn = config.get('jwt.expiresIn');
    this.secretOrKey = config.get('jwt.secret');

    const strategy = new Strategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.secretOrKey,
    }, (payload, done) => this.createAuthObj(payload)
      .then(user => done(null, user))
      .catch(error => done(error)));

    passport.use(strategy);
  }

  async createAuthObj(payload) {
    const user = await User.findOne({ id: payload.sub });

    return user;
  }

  generateJwt(user) {
    return jwt.sign(user instanceof User ? user.toJSON() : user, this.secretOrKey, {
      expiresIn: this.expiresIn,
    });
  }
}

module.exports = new JwtAuth();
