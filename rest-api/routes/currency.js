const express = require("express");
const router = express.Router();

const currencyService = require("../services/currencyService");

router.get("/", async (req, res) => {

    try {

        const data = await currencyService.getCurrency();

        res.json(data);

    } catch (err) {

        console.error(err.message);

        res.status(500).json({
            error: "Currency service unavailable"
        });
    }

});

module.exports = router;
