require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const { checkDatabase } = require("./db");
const weatherRoute = require("./routes/weather");
const currencyRoute = require("./routes/currency");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.get("/health", async (req, res) => {
    try {
        const result = await checkDatabase();
        if (result) {
            res.json({ status: "ok", db: "ok" });
            return;
        }
        res.json({ status: "ok" });
    } catch {
        res.status(503).json({ status: "error", db: "error" });
    }
});
app.use("/weather", weatherRoute);
app.use("/currency", currencyRoute);
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}
