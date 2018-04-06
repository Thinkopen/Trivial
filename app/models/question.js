const parse = require('csv-parse/lib/sync');

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

Question.importFromCsv = async function importFromCsv(csv) {
  const questionsArr = parse(csv);

  return Promise.all(questionsArr.map(async ([questionText, correctAnswerText, ...answersText]) => {
    const question = await Question.create({ text: questionText });

    await question.createAnswer({ text: correctAnswerText, correct: true });
    await Promise.all(answersText.map(answerText => question.createAnswer({ text: answerText })));
  }));
};

Question.associate = function associate() {
  const Answer = require('./answer');
  const Room = require('./room');
  const RoomQuestion = require('./roomQuestion');

  Question.hasMany(Answer);
  Question.belongsToMany(Room, { through: RoomQuestion });
};

module.exports = Question;
