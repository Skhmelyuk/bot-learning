const questions = require("../json-questions/questions.json");
const { Random, MersenneTwister19937 } = require("random-js");

const getRandomQuestion = (type) => {
  const engine = MersenneTwister19937.autoSeed();
  const random = new Random(engine);
  const questionsByType = questions[type.toLowerCase()];
  const randIndex = random.integer(0, questionsByType.length - 1);
  return questionsByType[randIndex];
};

const getCorrectAnswer = (type, id) => {
  const question = questions[type].find((q) => q.id === id);
  if (!question.hasOptions) {
    return question.answer;
  }
  return question.options.find((o) => o.isCorrect).text;
};

module.exports = {
  getRandomQuestion,
  getCorrectAnswer,
};
