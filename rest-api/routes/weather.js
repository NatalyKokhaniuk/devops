const express = require("express");
const router = express.Router();

const weatherService = require("../services/weatherService");

router.get("/", async (req, res) => {

    try {

        const city = req.query.city || "Lviv";

        const weather = await weatherService.getWeather(city);

        res.json(weather);

    } catch (err) {

        console.error(err.message);

        res.status(500).json({
            error: "Weather service unavailable"
        });
    }

});

module.exports = router;
