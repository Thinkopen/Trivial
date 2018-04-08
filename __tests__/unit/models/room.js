const { sequelize, sync } = require('../../../app/libraries/db');

const Room = require('../../../app/models/room');

describe('Models -> Room', () => {
  beforeEach(() => sync());

  test('it should be a model', () => {
    expect(Room).toHaveProperty('sequelize', sequelize);

    expect(Room).toHaveProperty('associate');
    expect(Room.associate).toBeInstanceOf(Function);
  });

  test('it should have the right attributes', () => {
    expect(Object.keys(Room.attributes)).toEqual(['id', 'startedAt', 'createdAt', 'updatedAt']);
  });

  test('it should have the right associations', () => {
    expect(Room.associations).toHaveProperty('questions');
    expect(Room.associations).toHaveProperty('users');
  });

  test('it should have the right methods', () => {
    expect(Room).toHaveProperty('prototype.setStarted');
    expect(Room.prototype.setStarted).toBeInstanceOf(Function);
  });
});
