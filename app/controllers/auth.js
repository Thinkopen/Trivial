const jwt = require('../libraries/jwt');
const facebook = require('../libraries/social/facebook');
const google = require('../libraries/social/google');

const User = require('../models/user');

const AbstractController = require('.');

class AuthController extends AbstractController {
  initRouter() {
    this.router.post('/validateFacebookToken', AuthController.validateFromSocial(facebook));
    this.router.post('/validateGoogleToken', AuthController.validateFromSocial(google));
  }

  static validateFromSocial(social) {
    return async (request, response) => {
      const { token } = request.body;

      if (!token) {
        throw new Error('No token provided');
      }

      const isValid = await social.validateToken(token);

      if (!isValid) {
        throw new Error('Invalid token');
      }

      const userRaw = await social.getMe(token);

      const [user] = await User.findCreateFind({
        where: {
          email: userRaw.email,
        },

        defaults: {
          name: userRaw.name,
        },
      });

      user.picture = user.picture || userRaw.picture;

      await user.save();

      const jwtToken = jwt.sign(user);

      response.json({ user, token: jwtToken });
    };
  }
}

module.exports = AuthController;
