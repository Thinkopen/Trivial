const fs = require('fs');
const { IncomingForm } = require('formidable');

const Answer = require('../models/answer');
const Question = require('../models/question');

const AbstractController = require('.');

class QuestionsController extends AbstractController {
  initRouter() {
    this.router.get('/', QuestionsController.actionList);
    this.router.get('/:questionId', QuestionsController.actionRetrieve);
    this.router.delete('/:questionId', QuestionsController.actionDelete);

    this.router.post('/import', QuestionsController.actionImport);

    this.router.param('questionId', QuestionsController.paramId);
  }

  static async actionList(request, response) {
    const questions = await Question.findAll({
      include: [{ model: Answer }],
    });

    response.json(questions);
  }

  static actionRetrieve(request, response) {
    response.json(request.question);
  }

  static async actionDelete(request, response) {
    await request.question.destroy();

    response.json();
  }

  static actionImport(request, response, next) {
    const form = new IncomingForm();

    form.parse(request, (error, fields, files) => {
      if (error) {
        throw new Error(error);
      }

      if (!files || !files.questions) {
        throw new Error('Questions file not found');
      }

      const questionsCsv = fs.readFileSync(files.questions.path, 'utf8');

      Question.importFromCsv(questionsCsv)
        .then(questions => response.json(questions))
        .catch(importError => next(importError));
    });
  }

  static async paramId(request, response, next, id) {
    const question = await Question.findOne({
      where: { id },
      include: [{ model: Answer }],
    });

    if (!question) {
      throw new Error('Question not found');
    }

    request.question = question;

    next();
  }
}

module.exports = QuestionsController;
