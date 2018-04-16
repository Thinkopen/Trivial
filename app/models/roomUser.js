const { Sequelize, sequelize } = require('../libraries/db');

const RoomUser = sequelize.define('roomUser', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  score: {
    type: Sequelize.DOUBLE,
  },
});

RoomUser.prototype.calculate = async function calculate() {
  const Answer = require('./answer');

  await this.reload({
    include: [{ model: Answer }],
  });

  this.score = this.answers.reduce((sum, answer) => sum + (answer.correct ? 10 : 0), 0);

  await this.save();
};

RoomUser.associate = function associate() {
  const Answer = require('./answer');
  const RoomUserAnswer = require('./roomUserAnswer');

  RoomUser.belongsToMany(Answer, { through: RoomUserAnswer });
};

module.exports = RoomUser;
