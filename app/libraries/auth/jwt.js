const config = require('config');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJwt = require('passport-jwt');

const User = require('../../models/user');

class JwtAuth {
  constructor() {
    this.secretOrKey = config.get('auth.jwt.secret');
    this.issuer = config.get('auth.jwt.issuer');
    this.audience = config.get('auth.jwt.audience');

    const strategy = new passportJwt.Strategy({
      jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeader(),
      secretOrKey: this.secretOrKey,
      issuer: this.issuer,
      audience: this.audience,
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
      audience: this.audience,
      issuer: this.issuer,
      subject: userId,
    });

    return token;
  }
}

module.exports = new JwtAuth();
