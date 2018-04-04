const config = require('config');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../../models/user');

class GoogleAuth {
  constructor() {
    this.scopes = ['profile', 'email'];

    const strategy = new GoogleStrategy({
      clientID: config.get('auth.google.clientId'),
      clientSecret: config.get('auth.google.clientSecret'),
      callbackURL: `${config.get('server.baseUrl')}${config.get('auth.google.callbackUrl')}`,
    }, async (accessToken, refreshToken, profile, done) => this.createAuthObj(profile)
      .then(user => done(null, user))
      .catch(error => done(error)));

    passport.use(strategy);
  }

  async createAuthObj(profile) {
    const emailObj = profile.emails.find(tmpEmailObj => tmpEmailObj.type === 'account');
    const email = emailObj ? emailObj.value : null;

    // const photoObj = profile.photos.find(tmpPhotoObj => !!tmpPhotoObj);
    // const photo = photoObj ? photoObj.value : null;

    const [user] = await User.findCreateFind({
      name: profile.displayName,
      email,
    });

    return user;
  }
}

module.exports = new GoogleAuth();
