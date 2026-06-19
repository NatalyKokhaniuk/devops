const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "users.db"));

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users(
            telegram_id INTEGER PRIMARY KEY,
            name TEXT,
            language TEXT,
            city TEXT,
            time_format TEXT
        )
    `);
});

module.exports = db;
