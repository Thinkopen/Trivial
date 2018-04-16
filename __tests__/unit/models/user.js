const { sequelize, sync } = require('../../../app/libraries/db');

const User = require('../../../app/models/user');

describe('Models -> User', () => {
  beforeEach(() => sync());

  test('it should be a model', () => {
    expect(User).toHaveProperty('sequelize', sequelize);

    expect(User).toHaveProperty('associate');
    expect(User.associate).toBeInstanceOf(Function);
  });

  test('it should have the right attributes', () => {
    expect(Object.keys(User.attributes)).toEqual(['id', 'name', 'email', 'picture', 'admin', 'createdAt', 'updatedAt']);
  });

  test('it should have the right associations', () => {
    expect(Object.keys(User.associations)).toEqual(['rooms']);
  });
});
