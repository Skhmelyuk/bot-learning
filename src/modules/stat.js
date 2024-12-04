const fs = require("fs");
const path = require("path");

// Функція для отримання поточної дати в форматі YYYY-MM-DD
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Оновлюємо шлях до файлу, щоб він містив поточну дату
function getStatsFilePath() {
  const currentDate = getCurrentDate();
  return path.join(`./src/json-stats/user_stats_${currentDate}.json`);
}

function updateUserStats(ctx) {
  // Отримуємо інформацію про користувача

  // Отримуємо поточний шлях до файлу статистики
  const statsFilePath = getStatsFilePath();

  const user = {
    id: ctx.message.from.id,
    first_name: ctx.message.from.first_name,
    last_name: ctx.message.from.last_name || "",
    username: ctx.message.from.username || "",
  };

  // Читаємо поточну статистику з файлу
  let stats = {};
  if (fs.existsSync(statsFilePath)) {
    const data = fs.readFileSync(statsFilePath, "utf8");
    stats = JSON.parse(data);
  } else {
    // Якщо файлу не існує, створюємо порожній об'єкт
    fs.writeFileSync(statsFilePath, "{}", "utf8");
  }

  // Якщо користувача немає в статистиці, додаємо його
  if (!stats[user.id]) {
    stats[user.id] = {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      interactions: 0,
    };
  }

  // Оновлюємо кількість взаємодій користувача
  stats[user.id].interactions += 1;

  // Зберігаємо оновлену статистику в JSON файл
  fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2), "utf8");
}

module.exports = {
  updateUserStats,
};
