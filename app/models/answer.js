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
  },
});

Answer.associate = function associate() {
  const Question = require('./question');

  Answer.belongsTo(Question);
};

module.exports = Answer;
