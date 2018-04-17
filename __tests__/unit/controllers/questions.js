const path = require('path');
const request = require('supertest');

const App = require('../../../app');

const Answer = require('../../../app/models/answer');
const Question = require('../../../app/models/question');

const app = new App();

const baseUrl = '/questions';
const importUrl = `${baseUrl}/import`;

describe('Controllers -> Questions', () => {
  const questionWithAnswersText = 'question with answers';

  beforeEach(() => app.listen()
    .then(() => Promise.all([1, 2].map(index => Question.create({ text: `question ${index}` }))))
    .then(() => Question.create({ text: questionWithAnswersText }))
    .then(question => Promise.all([1, 2].map(index => question.createAnswer({ text: `answer ${index}` })))));

  afterEach(() => app.close());

  test('it should return all the questions', () => request(app.app)
    .get(baseUrl)
    .expect(200)
    .then(({ body: questions }) => {
      expect(questions).toHaveLength(3);
    }));

  test('it should retrieve a question', () => Question.findOne()
    .then(question => request(app.app)
      .get(`${baseUrl}/${question.id}`)
      .expect(200)
      .then(({ body: theQuestion }) => {
        expect(theQuestion).toHaveProperty('id', question.id);
        expect(theQuestion).toHaveProperty('text', question.text);
      })));

  test('it should throw an error while retrieving a non-existing question', () => Question.findOne()
    .then(question => request(app.app)
      .get(`${baseUrl}/${question.id}3`)
      .expect(500)
      .then(({ body }) => expect(body).toHaveProperty('error', 'Question not found'))));

  test('it should retrieve a question with the answers', () => Question.findOne({
    where: { text: questionWithAnswersText },
    include: [{ model: Answer }],
  })
    .then(question => request(app.app)
      .get(`${baseUrl}/${question.id}`)
      .expect(200)
      .then(({ body: theQuestion }) => {
        expect(theQuestion).toHaveProperty('id', question.id);
        expect(theQuestion).toHaveProperty('text', question.text);

        expect(theQuestion).toHaveProperty('answers');
        expect(theQuestion.answers).toHaveLength(2);
      })));

  test('it should delete a question', () => Question.findOne()
    .then(question => request(app.app)
      .delete(`${baseUrl}/${question.id}`)
      .expect(200))
    .then(() => Question.findAll())
    .then(questions => expect(questions).toHaveLength(2)));

  test('it should import questions from a csv file', () => request(app.app)
    .post(importUrl)
    .attach('questions', path.join(__dirname, '..', '..', 'testUtils', 'questions.csv'))
    .expect(200)
    .then(() => Question.findAll())
    .then(questions => expect(questions).toHaveLength(5)));

  test('it should fail with other fields', () => request(app.app)
    .post(importUrl)
    .attach('questions', path.join(__dirname, '..', '..', 'testUtils', 'questions.csv'))
    .field('foo', 'bar')
    .expect(500)
    .then(({ body }) => expect(body).toHaveProperty('error', 'maxFieldsSize exceeded, received 3 bytes of field data')));

  test('it should fail if the file isn\'t in the right field', () => request(app.app)
    .post(importUrl)
    .attach('question', path.join(__dirname, '..', '..', 'testUtils', 'questions.csv'))
    .expect(500)
    .then(({ body }) => expect(body).toHaveProperty('error', 'Questions file not found')));

  test('it should fail if the file isn\'t formatted properly', () => request(app.app)
    .post(importUrl)
    .attach('questions', path.join(__dirname, '..', '..', 'testUtils', 'questions-wrong.csv'))
    .expect(500)
    .then(({ body }) => expect(body).toHaveProperty('error', 'Invalid opening quote at line 1')));
});
