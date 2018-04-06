const { Sequelize, sequelize } = require('../libraries/db');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

User.associate = function associate() {
  const Room = require('./room');
  const RoomUser = require('./roomUser');

  User.belongsToMany(Room, { through: RoomUser });
};

module.exports = User;
