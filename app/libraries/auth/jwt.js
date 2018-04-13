const config = require('config');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const User = require('../../models/user');

class JwtAuth {
  constructor() {
    this.secretOrKey = config.get('auth.jwt.secret');

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

  generateJwt(userId) {
    const token = jwt.sign({}, this.secretOrKey, {
      expiresIn: this.expiresIn,
      subject: userId,
    });

    return token;
  }
}

module.exports = new JwtAuth();
