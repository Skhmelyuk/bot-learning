const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Ти - дружній помічник для розробників, який спеціалізується на frontend розробці.
Твої відповіді мають бути:
1. Короткими та чіткими
2. З прикладами коду, де це доречно
3. З посиланнями на документацію, де це може бути корисно
4. Українською мовою
5. Фокусуватись на практичному застосуванні
6. Додавай до тексту емодзі.

Якщо питання не стосується розробки, ввічливо перенаправ розмову на тему програмування.`;

// Зберігання контексту розмови для кожного користувача
const conversationHistory = new Map();

async function getChatGPTResponse(message) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      model: "gpt-4o-mini",
      max_tokens: 500, // Обмеження довжини відповіді
      temperature: 0.7, // Контролює креативність відповідей (0 - консервативні, 1 - креативні)
      top_p: 0.9, // Контролює різноманітність відповідей (0.1 - консервативні, 1.0 - різноманітні)
      frequency_penalty: 0.5, // Знижує ймовірність повторення слів (-2.0 до 2.0)
      presence_penalty: 0.5, // Заохочує модель говорити про нові теми (-2.0 до 2.0)
      stream: false, // Якщо true, відповідь буде надходити частинами
      n: 1, // Кількість альтернативних відповідей
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error with ChatGPT:", error);
    return "Вибачте, сталася помилка при обробці вашого запиту. Спробуйте пізніше.";
  }
}

module.exports = {
  getChatGPTResponse,
};
