const { sequelize, sync } = require('../../../app/libraries/db');

const RoomUser = require('../../../app/models/roomUser');

describe('Models -> RoomUser', () => {
  beforeEach(() => sync());

  test('it should be a model', () => {
    expect(RoomUser).toHaveProperty('sequelize', sequelize);
  });

  test('it should have the right attributes', () => {
    expect(Object.keys(RoomUser.attributes)).toEqual(['id', 'score', 'createdAt', 'updatedAt', 'roomId', 'userId']);
  });

  test('it should have the right associations', () => {
    expect(Object.keys(RoomUser.associations)).toEqual(['answers']);
  });
});
