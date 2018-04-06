const { Sequelize, sequelize } = require('../libraries/db');

const RoomUser = sequelize.define('roomUser', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
});

RoomUser.associate = function associate() {};

module.exports = RoomUser;
