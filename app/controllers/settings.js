const config = require('config');

const Question = require('../models/question');

const AbstractController = require('.');

class SettingsController extends AbstractController {
  initRouter() {
    this.router.get('/', SettingsController.actionList);
  }

  static async actionList(request, response) {
    const environment = config.get('environment');
    const baseUrl = config.get('server.baseUrl');
    const quiz = config.get('quiz');
    const facebookClientId = config.get('facebook.clientId');
    const questionsCount = await Question.count({ limit: config.get('quiz.questionsCount') });

    response.json({
      environment,
      baseUrl,
      quiz,
      facebookClientId,
      questionsCount,
    });
  }
}

module.exports = SettingsController;
