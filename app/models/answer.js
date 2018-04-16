const { Sequelize, sequelize } = require('../libraries/db');

const Answer = sequelize.define('answer', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  text: {
    type: Sequelize.TEXT,
  },

  correct: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

Answer.associate = function associate() {
  const Question = require('./question');
  const RoomUser = require('./roomUser');
  const RoomUserAnswer = require('./roomUserAnswer');

  Answer.belongsTo(Question);
  Answer.belongsToMany(RoomUser, { through: RoomUserAnswer });
};

module.exports = Answer;
