const facebook = require('../libraries/facebook');

const AbstractController = require('.');

class AuthController extends AbstractController {
  initRouter() {
    this.router.post('/validateFacebookToken', AuthController.validateFromSocial(facebook));
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

      const me = social.getMe(token);

      response.json({ token, isValid });
    };
  }
}

module.exports = AuthController;
