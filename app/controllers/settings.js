const config = require('config');

const AbstractController = require('.');

class SettingsController extends AbstractController {
  initRouter() {
    this.router.get('/', SettingsController.actionList);
  }

  static actionList(request, response) {
    const environment = config.get('environment');
    const baseUrl = config.get('server.baseUrl');
    const quiz = config.get('quiz');
    const facebookClientId = config.get('facebook.clientId');

    response.json({
      environment,
      baseUrl,
      quiz,
      facebookClientId,
    });
  }
}

module.exports = SettingsController;
