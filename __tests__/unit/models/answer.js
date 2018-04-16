const { sequelize, sync } = require('../../../app/libraries/db');

const Answer = require('../../../app/models/answer');

describe('Models -> Answer', () => {
  beforeEach(() => sync());

  test('it should be a model', () => {
    expect(Answer).toHaveProperty('sequelize', sequelize);

    expect(Answer).toHaveProperty('associate');
    expect(Answer.associate).toBeInstanceOf(Function);
  });

  test('it should have the right attributes', () => {
    expect(Object.keys(Answer.attributes)).toEqual(['id', 'text', 'correct', 'createdAt', 'updatedAt', 'questionId']);
  });

  test('it should have the right associations', () => {
    expect(Answer.associations).toHaveProperty('question');
    expect(Answer.associations).toHaveProperty('roomQuestionUserAnswers');
  });
});
