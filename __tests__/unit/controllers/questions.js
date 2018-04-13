const path = require('path');
const request = require('supertest');

const App = require('../../../app');

const Question = require('../../../app/models/question');

const app = new App();

const baseUrl = '/questions';
const importUrl = `${baseUrl}/import`;

describe('Controllers -> Questions', () => {
  beforeEach(() => app.listen()
    .then(() => Promise.all([1, 2].map(index => Question.create({ text: `question ${index}` })))));

  afterEach(() => app.close());

  test('it should return all the questions', () => request(app.app)
    .get(baseUrl)
    .expect(200)
    .then(({ body: questions }) => {
      expect(questions).toHaveLength(2);
    }));

  test('it should retrieve a question', () => Question.findOne()
    .then(question => request(app.app)
      .get(`${baseUrl}/${question.id}`)
      .expect(200)
      .then(({ body: theQuestion }) => {
        expect(theQuestion).toHaveProperty('id', question.id);
        expect(theQuestion).toHaveProperty('text', question.text);
      })));

  test('it should delete a question', () => Question.findOne()
    .then(question => request(app.app)
      .delete(`${baseUrl}/${question.id}`)
      .expect(200))
    .then(() => Question.findAll())
    .then(questions => expect(questions).toHaveLength(1)));

  test('it should import questions from a csv file', () => request(app.app)
    .post(importUrl)
    .attach('questions', path.join(__dirname, '..', '..', 'testUtils', 'questions.csv'))
    .expect(200)
    .then(() => Question.findAll())
    .then(questions => expect(questions).toHaveLength(4)));
});