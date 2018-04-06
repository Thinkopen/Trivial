const { Sequelize, sequelize } = require('../libraries/db');

const Room = sequelize.define('room', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  startedAt: {
    type: Sequelize.DATE,
  },
}, {
  scopes: {
    active: {
      where: {
        startedAt: null,
      },
    },
  },
});

Room.associate = function associate() {
  const Question = require('./question');
  const RoomQuestion = require('./roomQuestion');
  const RoomUser = require('./roomUser');
  const User = require('./user');

  Room.belongsToMany(Question, { through: RoomQuestion });
  Room.belongsToMany(User, { through: RoomUser });
};

module.exports = Room;
