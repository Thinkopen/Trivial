const { sequelize, sync } = require('../../../app/libraries/db');

const RoomUserAnswer = require('../../../app/models/roomUserAnswer');

describe('Models -> RoomUserAnswer', () => {
  beforeEach(() => sync());

  test('it should be a model', () => {
    expect(RoomUserAnswer).toHaveProperty('sequelize', sequelize);
  });

  test('it should have the right attributes', () => {
    expect(Object.keys(RoomUserAnswer.attributes)).toEqual(['id', 'answeredAfter', 'createdAt', 'updatedAt', 'answerId', 'roomUserId']);
  });

  test('it should have the right associations', () => {
    expect(Object.keys(RoomUserAnswer.associations)).toEqual([]);
  });
});
