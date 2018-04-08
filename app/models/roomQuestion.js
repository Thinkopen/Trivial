const { Sequelize, sequelize } = require('../libraries/db');

const RoomQuestion = sequelize.define('roomQuestion', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  order: {
    type: Sequelize.INTEGER,
  },
});

module.exports = RoomQuestion;
