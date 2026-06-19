require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const db = require("./database/database");

if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is required");
}

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

const API = process.env.API_URL || "http://rest-api:3000";
const NLP = process.env.NLP_URL || "http://nlp-service:5000";

bot.onText(/\/start/, (msg) => {
    db.run(
        `INSERT OR IGNORE INTO users
        (telegram_id, name, language, city, time_format)
        VALUES (?, ?, ?, ?, ?)`,
        [msg.from.id, msg.from.first_name, "uk", "Kyiv", "24"]
    );
    bot.sendMessage(
        msg.chat.id,
        `Вітаю, ${msg.from.first_name}!\n\nКоманди:\n/weather <місто>\n/currency\n/profile\n/setcity <місто>\n/setlang <мова>\n/settime <формат>`
    );
});

bot.onText(/\/weather (.+)/, async (msg, match) => {
    try {
        const city = match[1];
        const response = await axios.get(
            `${API}/weather?city=${encodeURIComponent(city)}`
        );
        const w = response.data;
        bot.sendMessage(
            msg.chat.id,
            `Погода у ${w.city}\n\nТемпература: ${w.temperature}°C\nВологість: ${w.humidity}%\nОпис: ${w.weather}`
        );
    } catch {
        bot.sendMessage(msg.chat.id, "Не вдалося отримати погоду.");
    }
});

bot.onText(/\/currency/, async (msg) => {
    try {
        const response = await axios.get(`${API}/currency`);
        const c = response.data;
        bot.sendMessage(
            msg.chat.id,
            `Курс валют\n\nUSD: ${c.USD}\nEUR: ${c.EUR}\nUAH: ${c.UAH}\nGBP: ${c.GBP}`
        );
    } catch {
        bot.sendMessage(msg.chat.id, "Не вдалося отримати курс валют.");
    }
});

bot.on("message", async (msg) => {
    const text = (msg.text || "").trim();

    if (!text || text.startsWith("/")) {
        return;
    }

    try {
        const nlp = await axios.post(`${NLP}/analyze`, { text });
        const result = nlp.data;

        if (result.intent === "weather") {
            const city = result.city || "Kyiv";
            const weather = await axios.get(
                `${API}/weather?city=${encodeURIComponent(city)}`
            );
            const w = weather.data;

            bot.sendMessage(
                msg.chat.id,
                `Погода у ${w.city}\n\nТемпература: ${w.temperature}°C\nВологість: ${w.humidity}%\nОпис: ${w.weather}`
            );
            return;
        }

        if (result.intent === "currency") {
            const currency = await axios.get(`${API}/currency`);
            const c = currency.data;

            bot.sendMessage(
                msg.chat.id,
                `USD: ${c.USD}\nEUR: ${c.EUR}\nUAH: ${c.UAH}\nGBP: ${c.GBP}`
            );
            return;
        }

        bot.sendMessage(msg.chat.id, "Я не зрозумів повідомлення.");
    } catch {
        bot.sendMessage(msg.chat.id, "Помилка NLP.");
    }
});
