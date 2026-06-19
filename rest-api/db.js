const { Pool } = require("pg");

let pool;

function getPool() {
    if (!process.env.DB_HOST) {
        return null;
    }

    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 5432),
            database: process.env.DB_NAME || "appdb",
            user: process.env.DB_USER || "appuser",
            password: process.env.DB_PASSWORD || "apppassword"
        });
    }

    return pool;
}

async function checkDatabase() {
    const currentPool = getPool();

    if (!currentPool) {
        return false;
    }

    await currentPool.query("SELECT 1");
    return true;
}

module.exports = { checkDatabase };
