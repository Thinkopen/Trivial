const parse = require('csv-parse/lib/sync');

const { Sequelize, sequelize } = require('../libraries/db');

function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];

    array[currentIndex] = array[randomIndex]; // eslint-disable-line no-param-reassign
    array[randomIndex] = temporaryValue; // eslint-disable-line no-param-reassign
  }

  return array;
}

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

const oldToJSON = Question.prototype.toJSON;
Question.prototype.toJSON = function toJSON() {
  const question = oldToJSON.call(this);

  if (question.answers && question.answers.length) {
    question.answers = shuffle(question.answers);
  }

  return question;
};

Question.importFromCsv = async function importFromCsv(csv) {
  const questionsArr = parse(csv, { rtrim: true, relax_column_count: true });

  return Question.importFromArr(questionsArr);
};

Question.importFromArr = async function importFromArr(questionsArr) {
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
