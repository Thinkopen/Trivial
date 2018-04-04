const config = require('config');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../../models/user');

class GoogleAuth {
  constructor() {
    this.scopes = ['profile', 'email'];

    const strategy = new FacebookStrategy({
      clientID: config.get('auth.facebook.clientId'),
      clientSecret: config.get('auth.facebook.clientSecret'),
      callbackURL: `${config.get('server.baseUrl')}${config.get('auth.facebook.callbackUrl')}`,
    }, async (accessToken, refreshToken, profile, done) => this.createAuthObj(profile)
      .then(user => done(null, user))
      .catch(error => done(error)));

    passport.use(strategy);
  }

  async createAuthObj(profile) {
    const [user] = await User.findCreateFind({
      name: profile.displayName,
      email: profile.email,
    });

    return user;
  }
}

module.exports = new GoogleAuth();
