const { sequelize, sync } = require('../../../app/libraries/db');

const RoomQuestion = require('../../../app/models/roomQuestion');

describe('Models -> RoomQuestion', () => {
  beforeEach(() => sync());

  test('it should be a model', () => {
    expect(RoomQuestion).toHaveProperty('sequelize', sequelize);
  });

  test('it should have the right attributes', () => {
    expect(Object.keys(RoomQuestion.attributes)).toEqual(['id', 'order', 'createdAt', 'updatedAt', 'questionId', 'roomId']);
  });

  test('it should have the right associations', () => {
    expect(RoomQuestion.associations).toEqual({});
  });
});
