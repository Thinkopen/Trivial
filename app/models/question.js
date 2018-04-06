const { Sequelize, sequelize } = require('../libraries/db');

const Question = sequelize.define('question', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  text: {
    type: Sequelize.TEXT,
  },
});

Question.associate = function associate() {
  const Room = require('./room');
  const RoomQuestion = require('./roomQuestion');

  Question.belongsToMany(Room, { through: RoomQuestion });
};

module.exports = Question;
