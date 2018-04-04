const config = require('config');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../../models/user');

class GoogleAuth {
  constructor() {
    this.scopes = ['profile', 'email'];

    this.strategy = new GoogleStrategy({
      clientID: config.get('google.clientId'),
      clientSecret: config.get('google.clientSecret'),
      callbackURL: `${config.get('server.baseUrl')}${config.get('google.callbackUrl')}`,
    }, async (accessToken, refreshToken, profile, callback) => {
      const authObj = await this.createAuthObj(profile);

      callback(null, {
        accessToken,
        ...authObj,
      });
    });
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
