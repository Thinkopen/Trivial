const { sequelize, sync } = require('../../../app/libraries/db');

const Question = require('../../../app/models/question');

describe('Models -> Question', () => {
  beforeEach(() => sync());

  test('it should be a model', () => {
    expect(Question).toHaveProperty('sequelize', sequelize);

    expect(Question).toHaveProperty('associate');
    expect(Question.associate).toBeInstanceOf(Function);
  });

  test('it should have the right attributes', () => {
    expect(Object.keys(Question.attributes)).toEqual(['id', 'text', 'createdAt', 'updatedAt']);
  });

  test('it should have the right associations', () => {
    expect(Object.keys(Question.associations)).toEqual(['answers', 'rooms']);
  });

  test('it should have the right custom static methods', () => {
    expect(Question).toHaveProperty('importFromCsv');
    expect(Question.importFromCsv).toBeInstanceOf(Function);

    expect(Question).toHaveProperty('importFromArr');
    expect(Question.importFromArr).toBeInstanceOf(Function);
  });
});
