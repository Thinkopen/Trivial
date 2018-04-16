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

  startedAt: {
    type: Sequelize.DATE,
  },
});

RoomQuestion.prototype.setStarted = async function setStarted() {
  this.startedAt = new Date();

  return this.save();
};

module.exports = RoomQuestion;
