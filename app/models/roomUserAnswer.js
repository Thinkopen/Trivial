const { Sequelize, sequelize } = require('../libraries/db');

const RoomUserAnswer = sequelize.define('roomUserAnswer', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  answeredAfter: {
    type: Sequelize.DOUBLE,
  },
});

module.exports = RoomUserAnswer;
