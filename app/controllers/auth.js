const facebook = require('../libraries/facebook');

const AbstractController = require('.');

class AuthController extends AbstractController {
  initRouter() {
    this.router.post('/validateFacebookToken', AuthController.validateFromSocial(token => facebook.validateToken(token)));
  }

  static validateFromSocial(validate) {
    return async (request, response) => {
      const { token } = request.body;

      if (!token) {
        throw new Error('No token provided');
      }

      const isValid = await validate(token);

      if (!isValid) {
        throw new Error('Invalid token');
      }

      response.json({ token, isValid });
    };
  }
}

module.exports = AuthController;
